# -*- coding: utf-8 -*-
"""
Generate all brand and favicon assets for Interview Prep Portal:
- Perfectly preserves the full rounded bottom-left corner and smooth contour of the 3D doorway
- Identical dimensions, bounding box, perspective, and soft 3D ground shadow as GenAI portal reference
- Balanced square proportions with crisp transparent alpha channel
- Formats: PNG (all sizes), ICO (multi-res), SVGs
"""
import os
import zlib
import struct
import math
import base64

HERE = os.path.dirname(os.path.abspath(__file__))
BG_COLOR = (245, 247, 251, 255)

def unfilter_png(path):
    with open(path, "rb") as f:
        data = f.read()
    pos = 8
    chunks = []
    while pos < len(data):
        length, ctype = struct.unpack(">I4s", data[pos:pos+8])
        cdata = data[pos+8:pos+8+length]
        crc = data[pos+8+length:pos+12+length]
        chunks.append((ctype, cdata))
        pos += 12 + length
    ihdr = [c[1] for c in chunks if c[0] == b"IHDR"][0]
    w, h, depth, colortype, comp, filt, inter = struct.unpack(">IIBBBBB", ihdr)
    idat = b"".join([c[1] for c in chunks if c[0] == b"IDAT"])
    raw = zlib.decompress(idat)
    bpp = 4 if colortype == 6 else (3 if colortype == 2 else 1)
    stride = w * bpp
    pixels = bytearray(w * h * 4)
    pos = 0
    def paeth(a, b, c):
        p = a + b - c
        pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
        if pa <= pb and pa <= pc: return a
        elif pb <= pc: return b
        else: return c
    for y in range(h):
        ftype = raw[pos]
        pos += 1
        line = raw[pos:pos+stride]
        pos += stride
        for x in range(w):
            idx = (y * w + x) * 4
            for c in range(bpp):
                val = line[x*bpp + c]
                left = pixels[idx - 4 + c] if x > 0 else 0
                above = pixels[idx - w*4 + c] if y > 0 else 0
                aboveleft = pixels[idx - w*4 - 4 + c] if (y > 0 and x > 0) else 0
                if ftype == 0: recon = val
                elif ftype == 1: recon = (val + left) & 0xff
                elif ftype == 2: recon = (val + above) & 0xff
                elif ftype == 3: recon = (val + ((left + above) >> 1)) & 0xff
                elif ftype == 4: recon = (val + paeth(left, above, aboveleft)) & 0xff
                pixels[idx + c] = recon
            if bpp == 3: pixels[idx + 3] = 255
    return w, h, pixels

def encode_png(w, h, pixels):
    raw = bytearray()
    stride = w * 4
    for y in range(h):
        raw.append(0)
        raw.extend(pixels[y*stride:(y+1)*stride])
    comp = zlib.compress(bytes(raw), 9)
    def chunk(ctype, data):
        c = ctype + data
        crc = zlib.crc32(c)
        return struct.pack(">I", len(data)) + c + struct.pack(">I", crc)
    out = b"\x89PNG\r\n\x1a\n"
    out += chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
    out += chunk(b"IDAT", comp)
    out += chunk(b"IEND", b"")
    return out

def save_png(path, w, h, pixels):
    with open(path, "wb") as f:
        f.write(encode_png(w, h, pixels))

def resize_rgba(src_w, src_h, src_px, dst_w, dst_h):
    dst_px = bytearray(dst_w * dst_h * 4)
    x_scale = src_w / dst_w
    y_scale = src_h / dst_h
    for dy in range(dst_h):
        sy = (dy + 0.5) * y_scale - 0.5
        y0 = int(math.floor(sy))
        y1 = min(src_h - 1, y0 + 1)
        y0 = max(0, y0)
        wy1 = sy - y0
        wy0 = 1.0 - wy1
        for dx in range(dst_w):
            sx = (dx + 0.5) * x_scale - 0.5
            x0 = int(math.floor(sx))
            x1 = min(src_w - 1, x0 + 1)
            x0 = max(0, x0)
            wx1 = sx - x0
            wx0 = 1.0 - wx1
            
            dst_idx = (dy * dst_w + dx) * 4
            for c in range(4):
                v00 = src_px[(y0 * src_w + x0) * 4 + c]
                v01 = src_px[(y0 * src_w + x1) * 4 + c]
                v10 = src_px[(y1 * src_w + x0) * 4 + c]
                v11 = src_px[(y1 * src_w + x1) * 4 + c]
                val = (v00 * wx0 + v01 * wx1) * wy0 + (v10 * wx0 + v11 * wx1) * wy1
                dst_px[dst_idx + c] = int(round(val))
    return dst_px

def create_opaque(src_w, src_h, src_px, size, pad_frac=0.0):
    canvas = bytearray(size * size * 4)
    for i in range(size * size):
        canvas[i*4 + 0] = BG_COLOR[0]
        canvas[i*4 + 1] = BG_COLOR[1]
        canvas[i*4 + 2] = BG_COLOR[2]
        canvas[i*4 + 3] = BG_COLOR[3]
    
    inner_h = int(size * (1 - 2 * pad_frac))
    inner_w = int(src_w * (inner_h / float(src_h)))
    if inner_w > int(size * (1 - 2 * pad_frac)):
        inner_w = int(size * (1 - 2 * pad_frac))
        inner_h = int(src_h * (inner_w / float(src_w)))
        
    scaled = resize_rgba(src_w, src_h, src_px, inner_w, inner_h)
    off_x = (size - inner_w) // 2
    off_y = (size - inner_h) // 2
    
    for y in range(inner_h):
        for x in range(inner_w):
            s_idx = (y * inner_w + x) * 4
            d_idx = ((off_y + y) * size + (off_x + x)) * 4
            sa = scaled[s_idx + 3] / 255.0
            for c in range(3):
                canvas[d_idx + c] = int(round(canvas[d_idx + c] * (1 - sa) + scaled[s_idx + c] * sa))
            canvas[d_idx + 3] = 255
    return canvas

def make_ico(sizes_dict):
    num_images = len(sizes_dict)
    header = struct.pack("<HHH", 0, 1, num_images)
    entries = bytearray()
    image_data = bytearray()
    offset = 6 + 16 * num_images
    for w, h, png_bytes in sizes_dict:
        length = len(png_bytes)
        entries += struct.pack("<BBBBHHII",
                               w if w < 256 else 0,
                               h if h < 256 else 0,
                               0, 0, 1, 32, length, offset + len(image_data))
        image_data += png_bytes
    return bytes(header + entries + image_data)

def generate_all():
    src_logo = "/Users/deepankar/Desktop/learning portals/interview portal logo.png"
    w, h, px = unfilter_png(src_logo)
    print(f"Loaded master source: {w}x{h}")

    fg_mask = bytearray(w * h)

    bottom_curve = [
        (640, 1150),
        (660, 1205),
        (680, 1245),
        (700, 1280),
        (730, 1305),
        (760, 1320),
        (800, 1328),
        (850, 1335),
        (900, 1340),
        (1000, 1348),
        (1100, 1360),
        (1200, 1375),
        (1300, 1385),
        (1380, 1385),
        (1440, 1375),
        (1480, 1360),
        (1600, 1310),
        (1750, 1230),
        (1850, 1140)
    ]

    def get_bottom_y(x):
        if x < 640 or x > 1850: return 0
        for i in range(len(bottom_curve)-1):
            x1, y1 = bottom_curve[i]
            x2, y2 = bottom_curve[i+1]
            if x1 <= x <= x2:
                t = (x - x1) / float(x2 - x1)
                return y1 + (y2 - y1) * t
        return 0

    for x in range(640, 1851):
        bot_y = get_bottom_y(x)
        for y in range(70, int(bot_y) + 1):
            idx = (y * w + x) * 4
            r, g, b = px[idx], px[idx+1], px[idx+2]
            diff = max(abs(r - g), abs(g - b), abs(r - b))
            
            is_mint = (g >= 180 and r >= 130 and b >= 130 and g > r + 4 and g > b + 3)
            is_text = (r <= 55 and g <= 105 and b <= 95 and g > r + 8)
            is_emerald = (g >= 35 and r <= 55 and b <= 120 and g > r + 10)
            is_arrow = (g >= 135 and g > r + 10 and g > b + 10)
            is_frame_edge = (g >= 65 and r <= 95 and b <= 135 and g > r + 8)
            is_icon = (r <= 55 and g <= 95 and b <= 105)
            
            if diff > 6 and (is_mint or is_text or is_emerald or is_arrow or is_frame_edge or is_icon):
                fg_mask[y * w + x] = 1

    for x in range(1850, 2200):
        for y in range(500, 1010):
            idx = (y * w + x) * 4
            r, g, b = px[idx], px[idx+1], px[idx+2]
            diff = max(abs(r - g), abs(g - b), abs(r - b))
            
            in_shaft = (1850 <= x <= 2030 and 645 <= y <= 890)
            in_head = False
            if 2030 <= x <= 2195:
                top_slant_y = 540 + (x - 2030) * (768 - 540) / (2195 - 2030.0)
                bot_slant_y = 990 - (x - 2030) * (990 - 768) / (2195 - 2030.0)
                in_head = (top_slant_y - 8 <= y <= bot_slant_y + 8)
            elif 1960 <= x <= 2030:
                in_head = (530 <= y <= 1000)
                
            if (in_shaft or in_head) and diff > 8:
                fg_mask[y * w + x] = 1

    min_y = 85
    max_y = 1385
    crop_h = max_y - min_y + 1 # 1301

    target_size = 512
    scale = 450.0 / crop_h # 0.3458

    def map_dst_to_src_x(dst_x):
        if dst_x < 24:
            return 640 - (24 - dst_x) / scale
        if dst_x <= 440:
            return 640 + (dst_x - 24) / scale
        if dst_x <= 488:
            t = (dst_x - 440) / (488 - 440.0)
            return 2010 + (2195 - 2010.0) * t
        return 2195 + (dst_x - 488) / scale

    door_512 = bytearray(target_size * target_size * 4)

    # 1. Soft 3D ground shadow underneath door base
    for sy in range(430, 505):
        for sx in range(100, 450):
            dx = (sx - 270.0) / 155.0
            dy = (sy - 466.0) / 22.0
            dist = math.sqrt(dx*dx + dy*dy)
            if dist < 1.0:
                alpha = (1.0 - dist) * 0.32
                alpha = math.pow(alpha, 1.2)
                s_idx = (sy * target_size + sx) * 4
                door_512[s_idx + 0] = 20
                door_512[s_idx + 1] = 60
                door_512[s_idx + 2] = 45
                door_512[s_idx + 3] = int(round(alpha * 255))

    # 2. Render solid 3D door body
    off_y = 26
    for dy in range(int(round(crop_h * scale)) + 1):
        dst_y = off_y + dy
        if dst_y < 0 or dst_y >= target_size: continue
        src_y = min_y + (dy / scale)
        y0 = int(math.floor(src_y))
        y1 = min(h - 1, y0 + 1)
        wy1 = src_y - y0
        wy0 = 1.0 - wy1
        
        for dst_x in range(target_size):
            src_x = map_dst_to_src_x(dst_x)
            if src_x < 0 or src_x >= w: continue
            x0 = int(math.floor(src_x))
            x1 = min(w - 1, x0 + 1)
            wx1 = src_x - x0
            wx0 = 1.0 - wx1
            
            cov = (fg_mask[y0 * w + x0] + fg_mask[y0 * w + x1] + fg_mask[y1 * w + x0] + fg_mask[y1 * w + x1]) / 4.0
            if cov <= 0: continue
            
            dst_idx = (dst_y * target_size + dst_x) * 4
            
            r_val = (px[(y0 * w + x0) * 4 + 0] * wx0 + px[(y0 * w + x1) * 4 + 0] * wx1) * wy0 + \
                    (px[(y1 * w + x0) * 4 + 0] * wx0 + px[(y1 * w + x1) * 4 + 0] * wx1) * wy1
            g_val = (px[(y0 * w + x0) * 4 + 1] * wx0 + px[(y0 * w + x1) * 4 + 1] * wx1) * wy0 + \
                    (px[(y1 * w + x0) * 4 + 1] * wx0 + px[(y1 * w + x1) * 4 + 1] * wx1) * wy1
            b_val = (px[(y0 * w + x0) * 4 + 2] * wx0 + px[(y0 * w + x1) * 4 + 2] * wx1) * wy0 + \
                    (px[(y1 * w + x0) * 4 + 2] * wx0 + px[(y1 * w + x1) * 4 + 2] * wx1) * wy1
                    
            fg_a = cov
            bg_a = door_512[dst_idx + 3] / 255.0
            final_a = fg_a + bg_a * (1.0 - fg_a)
            if final_a > 0:
                door_512[dst_idx + 0] = int(round((r_val * fg_a + door_512[dst_idx + 0] * bg_a * (1.0 - fg_a)) / final_a))
                door_512[dst_idx + 1] = int(round((g_val * fg_a + door_512[dst_idx + 1] * bg_a * (1.0 - fg_a)) / final_a))
                door_512[dst_idx + 2] = int(round((b_val * fg_a + door_512[dst_idx + 2] * bg_a * (1.0 - fg_a)) / final_a))
                door_512[dst_idx + 3] = int(round(final_a * 255))

    print("Writing brand assets...")
    # Master PNGs
    save_png(os.path.join(HERE, "source-icon.png"), target_size, target_size, door_512)
    save_png(os.path.join(HERE, "interview-room-logo.png"), target_size, target_size, door_512)
    save_png(os.path.join(HERE, "switch-job-logo.png"), target_size, target_size, door_512)
    save_png(os.path.join(HERE, "interview-room-favicon.png"), target_size, target_size, door_512)

    # App & Tile Icons
    save_png(os.path.join(HERE, "icon-512.png"), target_size, target_size, create_opaque(target_size, target_size, door_512, 512, pad_frac=0.0))
    save_png(os.path.join(HERE, "icon-maskable-512.png"), target_size, target_size, create_opaque(target_size, target_size, door_512, 512, pad_frac=0.08))
    save_png(os.path.join(HERE, "icon-192.png"), 192, 192, create_opaque(target_size, target_size, door_512, 192, pad_frac=0.0))
    save_png(os.path.join(HERE, "apple-touch-icon.png"), 180, 180, create_opaque(target_size, target_size, door_512, 180, pad_frac=0.0))
    save_png(os.path.join(HERE, "mstile-150x150.png"), 150, 150, create_opaque(target_size, target_size, door_512, 150, pad_frac=0.04))

    # Favicons (transparent)
    fav_32_px = resize_rgba(target_size, target_size, door_512, 32, 32)
    fav_16_px = resize_rgba(target_size, target_size, door_512, 16, 16)
    fav_48_px = resize_rgba(target_size, target_size, door_512, 48, 48)
    fav_64_px = resize_rgba(target_size, target_size, door_512, 64, 64)

    save_png(os.path.join(HERE, "favicon-32.png"), 32, 32, fav_32_px)
    save_png(os.path.join(HERE, "favicon-16.png"), 16, 16, fav_16_px)

    ico_data = make_ico([
        (16, 16, encode_png(16, 16, fav_16_px)),
        (32, 32, encode_png(32, 32, fav_32_px)),
        (48, 48, encode_png(48, 48, fav_48_px)),
        (64, 64, encode_png(64, 64, fav_64_px))
    ])
    with open(os.path.join(HERE, "favicon.ico"), "wb") as f:
        f.write(ico_data)

    # Scalable Vector SVGs
    b64_png = base64.b64encode(encode_png(target_size, target_size, door_512)).decode("ascii")
    svg_mark = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,{b64_png}"/></svg>'

    with open(os.path.join(HERE, "interview-room-logo.svg"), "w", encoding="utf-8") as f:
        f.write(svg_mark)
    with open(os.path.join(HERE, "switch-job-logo.svg"), "w", encoding="utf-8") as f:
        f.write(svg_mark)
    with open(os.path.join(HERE, "logo-glass.svg"), "w", encoding="utf-8") as f:
        f.write(svg_mark)
    with open(os.path.join(HERE, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_mark)

    print("DONE: Generated all Interview Prep brand and favicon assets successfully!")

if __name__ == "__main__":
    generate_all()
