/* The story of AI - one continuous narrative, from early statistics to multi-agent
   systems. Data-only file; rendered by bootStory() in assets/portal.js.

   Body text uses the same light syntax as card answers: blank line = new paragraph,
   "- " = bullet, "### " = small heading, "> " = callout, lines indented by 2+ spaces
   = a formula or aligned block. Glossary tooltips are applied to every paragraph
   (the page passes the "story" prefix; section-only terms include it).

   Dates checked against the original papers and announcements (Sept 2026). */

window.IR = window.IR || {};

window.IR.story = {
  title: "The story of AI: from counting data to teams of agents",
  chapters: [

{
  era: "1800s to 1950s",
  title: "It starts with counting and averages",
  body: `The story doesn't begin with computers. It begins about two hundred years ago, with people trying to make sense of messy measurements. Astronomers measuring the path of a comet got slightly different numbers every night, and they needed a fair way to draw one line through all of them. In 1805 the French mathematician Adrien-Marie Legendre published the method of **least squares**: choose the line that makes the squared gaps between the line and the points as small as possible. Carl Friedrich Gauss showed why this works so well when errors are random. That single idea, fit a line to data by making the errors small, is still at the heart of machine learning today.

Later in the 1800s Francis Galton, studying the heights of parents and children, noticed that very tall parents tended to have children closer to average height. He called this "regression towards the mean", and the word **regression** stuck for any method that predicts a number from other numbers. Karl Pearson gave us correlation, a single number for how strongly two things move together.

In the 1920s Ronald Fisher turned statistics into a practical tool for science. Working on farm experiments, he developed **ANOVA** (analysis of variance), a way to tell whether differences between groups, such as crops grown with different fertilisers, are real or just luck. Fisher, and later Jerzy Neyman and Egon Pearson, gave us **hypothesis testing** and the **p-value**: start by assuming nothing is going on, then ask how surprising the data would be if that were true.

> **The idea to carry forward:** data is noisy, so we need methods that find the real pattern and tell us how sure we can be. Everything that follows is a more powerful answer to that same need.`
},

{
  era: "1930s to 1980s",
  title: "Predicting a number, a category, or the future",
  body: `Once people could fit lines and test ideas, they started asking statistics to predict. Two kinds of prediction became the backbone of the field, and they still are.

**Regression** predicts a number: tomorrow's pressure, next month's sales, a house price. **Classification** predicts a category: spam or not spam, pass or fail, which species a flower belongs to. In 1936 Fisher showed how to separate flower species using measurements of their petals, and his iris dataset is still used to teach classification. In the 1940s and 1950s **logistic regression** gave a clean way to predict the probability of a yes-or-no outcome, and it is still one of the most used models in banks and hospitals.

Businesses also needed to see the future. From the 1950s, **exponential smoothing** forecast demand by giving recent data more weight than old data. In 1970 George Box and Gwilym Jenkins published the method behind **ARIMA** models, which forecast a series from its own past values and past errors. For decades ARIMA was the standard way to forecast anything measured over time, from electricity demand to stock levels.

These models had a strength and a limit. They were simple, understandable and needed little data. But a person had to choose the inputs and the shape of the model, and they struggled when patterns were complicated, such as many factors interacting in curved, non-straight ways.`
},

{
  era: "1950s to 2010",
  title: "Machines start to learn",
  body: `In 1950 Alan Turing asked whether machines could think. In 1959 Arthur Samuel, who built a checkers program that got better by playing itself, popularised the term **machine learning**: computers that learn from data instead of following hand-written rules. The difference from classic statistics is mostly one of focus. Statistics asks "what is true about this data, and how sure are we?" Machine learning asks "how well can we predict new data?"

The first artificial neuron that could learn, the **perceptron**, arrived in 1958. It could only draw a single straight line between two groups, and when its limits became clear in 1969, funding dried up. This was the first of two "AI winters", periods when hype outran results.

The practical progress of the next decades came from a family of models that learned patterns from tables of data. **Decision trees** (1980s) learned a flowchart of yes-or-no questions. **Support vector machines** (1990s) found the widest possible gap between groups. **Random forests** (2001) combined hundreds of trees, each trained on a slightly different sample, and averaged their votes. **Gradient boosting** built trees one after another, each fixing the mistakes of the ones before; its fast version, **XGBoost** (2014), won so many competitions that it became the default for table data. Free libraries such as **scikit-learn** made all of this a few lines of Python, which is when machine learning became an everyday tool rather than a research topic.

Meanwhile, neural networks came back. In 1986 **backpropagation** showed how to train networks with hidden layers, and in 1989 Yann LeCun's network read handwritten digits on bank cheques. But networks were slow to train and needed more data than most people had, so for tabular business problems the tree-based models kept winning. For table data, they often still do.`
},

{
  era: "2006 to 2016",
  title: "Deep learning, and machines that see",
  body: `Three things came together in the late 2000s: huge datasets from the internet, fast graphics cards (**GPUs**) that could do thousands of calculations at once, and better training tricks. In 2009 the **ImageNet** project published over a million labelled photos. In 2012 a deep **convolutional neural network** called **AlexNet**, trained on two gaming GPUs, won the ImageNet contest by a margin nobody expected, cutting the error from about 26% to about 15%. That result started the deep learning era.

A convolutional network (CNN) slides small filters over an image. The first layers learn to spot edges, the middle layers shapes, and the deep layers whole objects, without anyone telling them what an edge is. Networks kept getting deeper: **ResNet** (2015) trained 152 layers by adding shortcut connections, an idea the transformer would later reuse.

Recognising what is in a photo was not enough; people wanted to find where things are. Object detection answers "what and where", drawing a box around each object. Early detectors looked at an image many times over, which was slow. In 2015 Joseph Redmon's **YOLO**, "You Only Look Once", treated detection as a single pass of one network, running at about 45 frames per second. That made real-time detection practical for cameras, cars and factory lines. Deep learning had now beaten hand-built methods for images, and speech recognition was falling the same way. Language was next, and language is harder, because order and meaning stretch across whole sentences.`
},

{
  era: "1990 to 2015",
  title: "When order matters: RNNs and LSTMs",
  body: `Images are a grid you can see all at once. Language, speech and sensor readings are **sequences**: what comes next depends on what came before. "Open the valve, then start the pump" is not the same instruction as the reverse. Classic forecasting models like ARIMA handled simple, regular patterns well, but struggled with long, many-factor, non-linear sequences, and they couldn't handle language at all.

**Recurrent neural networks** (RNNs), from around 1990, read a sequence one step at a time and carry a running memory, the **hidden state**, from each step to the next. It is like reading a manual while keeping a short note in your head, updated after every word. The problem was training. The learning signal had to travel back through every step, and it shrank a little each time until it vanished, so RNNs forgot things from more than a few steps back. This is the **vanishing gradient** problem.

In 1997 Sepp Hochreiter and Jürgen Schmidhuber published the **LSTM** (Long Short-Term Memory). It adds a separate memory line with three **gates**: one decides what to forget, one what to add, and one what to use now. Because the memory is updated by adding and removing rather than being multiplied again and again, it survives hundreds of steps. A simpler cousin, the **GRU**, followed in 2014. By the mid-2010s LSTMs powered speech recognition, translation, predictive keyboards and many forecasting systems.

They had two limits that set up the next chapter. They were slow to train, because step 50 had to wait for step 49, so GPUs sat mostly idle. And memory still faded over long documents. Worth knowing for interviews: for plain business forecasting, LSTMs did not simply replace ARIMA and boosted trees. They shine on long, complex, many-signal sequences; simple series are often forecast just as well by the older methods.`
},

{
  era: "1950s to 2018",
  title: "Turning words into numbers",
  body: `Every model needs numbers, so language needed a way to become numbers. The first answers were crude. **One-hot** encoding gave every word its own slot in a huge list, all zeros except a single one. **Bag of words** counted how often each word appeared, and **TF-IDF** weighted words that are frequent in one document but rare overall. These worked for search and spam filters, but they had no idea of meaning: "car" and "automobile" were as unrelated as "car" and "banana", and word order was thrown away.

The breakthrough was the **word embedding**: a short list of a few hundred numbers per word, learned so that words used in similar ways end up close together. In 2013 Tomas Mikolov's team at Google released **Word2Vec**, which learned these vectors by predicting a word from its neighbours, or the neighbours from the word. The famous result was that directions carry meaning: king minus man plus woman lands near queen. Stanford's **GloVe** (2014) learned similar vectors from word counts across a whole corpus.

It would be unfair to call Word2Vec a bad encoding. It was a leap forward, and every modern embedding builds on its idea. Its real limit was that it was **static**: one vector per word, whatever the sentence. "Bank" had the same vector in "river bank" and "bank loan", and "trip" the same in "compressor trip" and "site trip". In 2018 **ELMo** made the vector depend on the sentence around the word, using LSTMs. These **contextual embeddings** were the bridge to the models that followed.`
},

{
  era: "2014",
  title: "Encoder and decoder, before the transformer",
  body: `Translation was the problem that pushed language models forward. In 2014 Ilya Sutskever and colleagues at Google, and in parallel Kyunghyun Cho and colleagues, introduced the **sequence-to-sequence** model. It has two parts. An **encoder** reads the input sentence one word at a time. A **decoder** writes the output sentence one word at a time.

This is where a common mix-up happens, so it's worth being precise: this was **not** a transformer. Both halves were recurrent networks. In Sutskever's version both the encoder and the decoder were deep LSTMs; Cho's version used the GRU. The encoder squeezed the whole sentence into its final hidden state, a single fixed-size **context vector**, and the decoder had to write the whole translation from that one vector.

That single vector was a **bottleneck**. It is like summarising a paragraph on a sticky note and translating from the note without looking back at the original. Short sentences were fine; long ones lost detail, and quality dropped as sentences got longer.

The fix came the same year. Dzmitry Bahdanau, Kyunghyun Cho and Yoshua Bengio added **attention**: instead of one summary vector, the decoder could look back at every encoder state and decide, for each word it writes, which input words matter most. Translating "the pressure valve", while writing the German word for valve, it puts most of its attention on "valve". Attention was still an add-on to an RNN, but it worked so well that people began to wonder whether the RNN was needed at all.`
},

{
  era: "2017",
  title: "\"Attention Is All You Need\" changes everything",
  body: `In June 2017 eight researchers at Google, led by Ashish Vaswani, published a paper with a bold title: "Attention Is All You Need". Its claim was that you could drop recurrence completely and build a translation model from attention alone. They called the new architecture the **transformer**.

The problem it solved was speed and reach. RNNs had to read word by word, which wasted GPUs and let distant words fade. In a transformer, every word looks at every other word at the same time. Training runs in parallel, and any two words are connected in a single step, however far apart they are.

The original transformer kept the encoder-decoder shape, but rebuilt both halves from attention. It stacked **six encoder blocks and six decoder blocks**. Its key parts are the ones interviewers ask about:
- **Scaled dot-product attention**, the core formula, explained in the next chapter.
- **Multi-head attention**: eight attention heads running side by side, each free to notice a different kind of relationship. This was in the original paper, not a later addition.
- **Positional encoding**: attention on its own ignores word order, so sine and cosine patterns are added to each word's vector to mark its position.
- **Feed-forward layers, residual connections and layer normalisation** in every block, to process each word and keep training stable.

The results made the field pay attention. It beat the best English-to-German and English-to-French translation scores (BLEU 28.4 and 41.8) while training far faster: the base model took about twelve hours on eight GPUs.

> **What to take into an interview:** parallel training wins; attention connects distant words directly; a simple design that scales with data and compute beats a clever one that doesn't; and the cost is that attention compares every token with every other, so it grows with the square of the text length.`,
  diagram: {
    kind: "lanes",
    alt: "From recurrent translation to the transformer: RNN and LSTM encoder-decoder in 2014, attention added to RNNs in 2014, the attention-only transformer in 2017, then BERT and GPT in 2018.",
    caption: "**Attention started as an add-on to RNNs and became the whole model.** The transformer removed recurrence and kept only attention.",
    lanes: [
      { label: "LSTM encoder-decoder", note: "2014, one context vector" },
      { label: "Attention added", note: "2014, still an RNN" },
      { label: "Transformer", note: "2017, attention only", accent: "accent" },
      { label: "BERT and GPT", note: "2018, the split" }
    ]
  }
},

{
  era: "Inside the transformer",
  title: "How attention works",
  body: `Attention answers one question for every word: which other words should I pay attention to, and how much? Take the sentence "The pump tripped because it overheated." To understand "it", the model needs to connect it to "pump", not to "because".

Each word starts as a vector (its embedding plus its position). From that vector the model makes three new vectors, using three weight matrices it learned during training:
- a **Query**: what this word is looking for;
- a **Key**: what this word offers to others;
- a **Value**: the information this word passes on if chosen.

A useful picture is a library. Your query is what you're searching for, each book's key is the label on its spine, and the value is what's inside. You compare your query with every label, and read most from the books whose labels match best.

In numbers: the model compares the Query of "it" with the Key of every word using a **dot product**, which gives a score for each. The scores are divided by the square root of the key size, because large vectors give large scores that would make softmax lock onto a single word. Then **softmax** turns the scores into weights that add up to 1. Finally the Values are mixed using those weights. The whole thing, for all words at once, is one line:

  Attention(Q, K, V) = softmax( Q × Kᵀ / √d_k ) × V

  Q × Kᵀ     compare every Query with every Key (Kᵀ is K turned sideways)
  / √d_k      shrink the scores (d_k = 64 in the paper, so divide by 8)
  softmax     turn each row of scores into weights that add up to 1
  × V         mix the Values by those weights

Note that softmax is applied to the Query-Key scores, not to the Keys and Values themselves, and Kᵀ is the transpose of the Key matrix. After this step, the vector for "it" carries some of the meaning of "pump".

**Multi-head attention** runs this several times in parallel with different learned matrices, so one head can track grammar, another which noun a pronoun refers to, another nearby words. In a decoder there is one more rule, the **causal mask**: each word may only look at the words before it, so the model can't cheat by seeing the word it's supposed to predict.`
},

{
  era: "Inside the transformer",
  title: "What a transformer block does, end to end",
  body: `A transformer is a stack of identical blocks. Text first goes through a **tokenizer**, which splits it into tokens (whole words or pieces of words) and turns each into a number. Each number is looked up in a table to get its **embedding**, and position information is added so the model knows the order.

Each block then does two things. First, **attention**: every token gathers information from the tokens it should pay attention to, as described in the last chapter. Second, a small **feed-forward network** processes each token on its own, which is where much of the model's stored knowledge seems to live. Around both steps sit **residual connections**, which add each step's input back to its output so information and learning signals pass easily through dozens of layers, and **layer normalisation**, which keeps the numbers in a steady range.

Stack the block many times and the vectors get richer at every layer. Early layers capture word forms and nearby words; later layers capture meaning, references and facts. The original paper used 6 layers; today's large models use around 30 to over 100.

The encoder and decoder differ in one important way. The **encoder** lets every token see every other token, both before and after it, which is ideal for understanding a whole text. The **decoder** uses the causal mask, so each token only sees earlier ones, which is what generating text one token at a time requires. In the original encoder-decoder design, the decoder also has **cross-attention**, where it looks at the encoder's output: the transformer's version of Bahdanau's idea.`,
  diagram: {
    alt: "A transformer block: text is tokenized and embedded with position, passes through attention and a feed-forward network with residual connections and normalisation, repeated for many layers, then produces the output.",
    caption: "**The same block, stacked many times.** Attention mixes information between tokens; the feed-forward step processes each token; residuals keep deep stacks trainable.",
    rows: [
      [{ id: "t", label: "Tokens + position", note: "embedding lookup" }],
      [{ id: "a", label: "Attention", note: "tokens share information", accent: "accent" }],
      [{ id: "f", label: "Feed-forward", note: "each token on its own" }],
      [{ id: "r", label: "Repeat the block", note: "6 to 100+ layers" }],
      [{ id: "o", label: "Output vectors", note: "to the next step" }]
    ],
    edges: [{ from: "t", to: "a" }, { from: "a", to: "f" }, { from: "f", to: "r" }, { from: "r", to: "o" }]
  }
},

{
  era: "2018 to 2020",
  title: "The family splits: BERT and GPT",
  body: `Within a year the transformer's two halves were being used separately, and that split shaped everything since.

In June 2018 OpenAI released **GPT** (Generative Pre-trained Transformer). It kept only the **decoder**. It was pre-trained on a large amount of text with one simple task, predict the next token, and then adapted to other tasks. Because it only looks backwards, it is naturally good at writing.

In October 2018 Google released **BERT**. It kept only the **encoder**. It was pre-trained by hiding about 15% of the words in each sentence and predicting them from the words on both sides (plus a task that guessed whether two sentences follow each other). Because it reads in both directions, it is excellent at understanding: search, classification, extracting names and values. In 2019, BERT started improving Google Search results. Google's **T5** (2019) kept both halves and framed every task as text in, text out.

Then came scale. **GPT-2** (2019) had 1.5 billion parameters and wrote surprisingly fluent text. **GPT-3** (2020) had 175 billion, and showed something new: it could do tasks it was never trained for, just from a few examples in the prompt. This is called **few-shot** learning, and it suggested that a big enough next-token predictor becomes a general tool.

It is often said that "modern transformers are all decoders". That's true for the big chat models such as GPT, Claude, Gemini and Llama. But encoders are far from gone: the embedding models and rerankers inside almost every RAG system are encoder-style models descended from BERT. And pre-training itself is a clever trick: next-token prediction needs no human labels, because every sentence already contains its own answer. That is why models could learn from almost all the text ever written.`
},

{
  era: "2018 to 2022",
  title: "How a decoder model is trained",
  body: `Training happens in stages, and the first one is by far the biggest.

**Pre-training** teaches the model language and knowledge. The model reads trillions of tokens of text. For every position it predicts the next token, compares its prediction with the real one using a loss called **cross-entropy**, and **backpropagation** nudges its billions of weights to do slightly better next time.

A common misunderstanding is that training happens word by word, with each predicted word fed back in. It doesn't. During training the whole sentence is already known, so the model is shown the real text and predicts every next token at every position **at the same time**, in one pass. The causal mask makes this fair: position 5 can only see positions 1 to 4, never the answer. Feeding the real previous words rather than the model's own guesses is called **teacher forcing**. This parallel training is exactly the advantage the transformer had over RNNs.

A pre-trained model can continue text but doesn't reliably follow instructions. So two more stages shape its behaviour. **Supervised fine-tuning** trains it on examples of instructions paired with good answers. Then **reinforcement learning from human feedback** (RLHF): people compare pairs of answers, a separate **reward model** learns their preferences, and the language model is tuned to earn higher rewards. OpenAI described this in its 2022 InstructGPT work, and on 30 November 2022 it released **ChatGPT**, built this way. Within two months it had tens of millions of users, and generative AI became a mainstream technology almost overnight.`
},

{
  era: "Inside an LLM",
  title: "How an LLM writes an answer, one token at a time",
  body: `When you send a question, the model doesn't write a whole answer in one go. It runs a loop.

First your text, together with the system prompt and chat history, is split into tokens. The tokens pass through every layer of the model. At the end, the vector for the last position goes through a final layer that produces one raw score, a **logit**, for every token in the model's vocabulary. That vocabulary is usually somewhere between about 30,000 and 200,000 tokens, not a few hundred words. A high logit means "very likely next"; a low one means "unlikely".

Then the model chooses one token:
- The logits are divided by the **temperature**. Below 1, the gaps between scores stretch and the top token dominates; above 1, they shrink and unusual tokens get more chances.
- **Softmax** turns the scores into probabilities that add up to 100%.
- **Top-k** keeps only the k most likely tokens, for example 50. **Top-p** keeps the smallest group whose probabilities add up to p, for example 90%, so it keeps fewer tokens when the model is confident and more when it isn't. You may hear "top-t" in interviews; it isn't a standard setting in the major APIs, so it's fair to ask what is meant.
- One token is drawn at random from what's left, according to the probabilities.

  p(token) = e^(logit / T) ÷ sum of e^(logit / T) over the kept tokens

That token is added to the text, and the loop runs again to pick the next one, until the model produces an end token or hits the length limit. This is **autoregressive** generation, and it's why answers appear word by word on the screen.

Running every layer again for the whole text at every step would be wasteful, because the earlier tokens haven't changed. So the model keeps a **KV cache**: it saves the Key and Value vectors of every earlier token. At each new step it only computes the Query, Key and Value for the one new token, compares that new Query with all the saved Keys, and mixes the saved Values. Queries of earlier tokens aren't needed again, so they aren't stored. The KV cache is a speed trick for writing answers; training doesn't need it, because training processes all positions at once.`,
  diagram: {
    kind: "lanes",
    alt: "The generation loop: tokens pass through the model, the last position produces a logit for every vocabulary token, temperature and softmax make probabilities, top-k or top-p keep the likely ones, one token is chosen and appended, and the loop repeats using the KV cache.",
    caption: "**One token per loop.** The network scores every token; temperature, softmax and top-p choose one; it's appended, and the KV cache keeps the next loop cheap.",
    lanes: [
      { label: "Tokens in", note: "prompt + history" },
      { label: "Model layers", note: "KV cache reused" },
      { label: "Logits", note: "one per vocab token" },
      { label: "÷ temperature, softmax", note: "probabilities" },
      { label: "Top-k / top-p", note: "pick one token", accent: "accent" },
      { label: "Append, repeat", note: "until end token" }
    ]
  }
},

{
  era: "2022 onwards",
  title: "What an LLM cannot know",
  body: `ChatGPT made the strengths of large language models obvious. It took people a little longer to see the limits clearly, and those limits drive the rest of this story.

- **A knowledge cutoff.** A model only knows what was in its training data, which stops at a certain date. Ask about last week and it simply doesn't know.
- **No private knowledge.** It has never seen your company's manuals, contracts, policies or database. It can't answer "what is the maximum pressure for compressor K-101 at our plant?"
- **No personal context.** It doesn't know who you are, what you're allowed to see, or what you asked yesterday, unless you tell it.
- **Hallucination.** Because it always predicts a likely next token, it produces confident, fluent text even when it doesn't know. The result can be wrong but sound right.
- **It can't act.** On its own it can only produce text. It can't look something up, run a calculation reliably, send an email or update a record.

Retraining the model every time a document changes is far too slow and expensive, and fine-tuning is better at teaching style than at adding facts reliably. The industry needed a way to give the model the right information at the moment of the question, and a way to let it take actions. The next chapters are those two answers.`
},

{
  era: "2020 onwards",
  title: "RAG: give the model an open book",
  body: `The first answer is **retrieval-augmented generation**, or **RAG**. The idea is to turn a closed-book exam into an open-book one: before the model answers, search your own documents for the passages that matter, and hand them to the model with the question.

The approach was described in a 2020 paper by Patrick Lewis and colleagues at Facebook AI Research, presented at NeurIPS 2020, which combined a retriever with a text generator so that knowledge could be updated simply by changing the documents. So RAG actually predates ChatGPT. It became everyday engineering in 2023, when companies wanted ChatGPT-style answers over their own data.

A RAG system has two halves. **Ahead of time**, documents are parsed into clean text, split into **chunks** of a few hundred tokens, turned into **embeddings** by an encoder-style model, and stored in a **vector database** with details such as source, page and who may see them. **At question time**, the question is embedded too, the most similar chunks are found (often combined with keyword search, called **hybrid search**, and re-ordered by a **reranker**), and the best few are placed in the prompt. The model answers from them and cites its sources.

RAG fixes the cutoff and the private-knowledge problems, because the facts come from your current documents, and it lets you apply permissions before anything reaches the model. It reduces hallucination but doesn't remove it: if the search brings back the wrong passage, the model can still answer confidently from it. That is why real RAG work is mostly about parsing, chunking, retrieval quality and evaluation, not the model.`,
  diagram: {
    kind: "lanes",
    alt: "RAG in two halves: documents are parsed, chunked, embedded and indexed ahead of time; at question time the question is searched, the best chunks are reranked and passed to the LLM, which answers with citations.",
    caption: "**Look it up, then answer.** The facts come from your own current documents, so no retraining is needed.",
    lanes: [
      { label: "Parse + chunk", note: "ahead of time" },
      { label: "Embed + index", note: "vector database" },
      { label: "Search", note: "hybrid, with permissions" },
      { label: "Rerank", note: "best few chunks" },
      { label: "LLM answers", note: "with citations", accent: "accent" }
    ]
  }
},

{
  era: "2022 to 2023",
  title: "Giving the model hands: tools",
  body: `RAG gives the model knowledge. The second answer gives it the ability to act. The idea is simple: describe some functions to the model, such as "search the documents", "look up equipment data" or "create a ticket". When the model decides a function would help, it doesn't run it itself. It replies with the function's name and the inputs, your code runs it, and the result is sent back to the model to continue.

Researchers showed this could work in 2022 and early 2023. The **ReAct** paper (Yao and colleagues, 2022) had models alternate between reasoning in text and taking actions such as searches, looking at the result each time before deciding the next step. Meta's **Toolformer** (2023) trained a model to decide by itself when to call a calculator or a search engine. Then on 13 June 2023 OpenAI added **function calling** to its API: the model could return a structured JSON request to call a function you had described. Other providers followed with their own versions, generally called **tool calling** or tool use.

This worked, but it created a wiring problem. Every AI application connected to every tool in its own way. If ten AI apps each wanted to connect to ten systems, such as a file store, a database, a ticketing tool and a code repository, that meant a hundred separate custom integrations, each written and maintained by hand.`
},

{
  era: "November 2024 onwards",
  title: "MCP: one standard plug for every tool",
  body: `In November 2024 Anthropic open-sourced the **Model Context Protocol** (**MCP**) to solve that wiring problem. The usual comparison is USB-C: instead of a different cable for every device, one standard plug that everything supports. Write a connector for a system once, as an MCP server, and any AI application that speaks MCP can use it.

It's worth being precise about what MCP did and didn't do. It didn't invent tool use; function calling already existed. What it standardised is how an AI application discovers tools and data, and how it talks to them.

MCP has three roles:
- The **host** is the AI application the user works in, such as a chat app, an IDE or an agent.
- The **client** lives inside the host and holds a connection to one server.
- The **server** is a small program that wraps a real system, such as a document store, a database or a ticketing tool, and exposes it in a standard way.

A server can offer three kinds of things: **tools** (actions the model can call, like "search documents" or "create ticket"), **resources** (data the application can read, like a file or a record) and **prompts** (ready-made templates). Messages use JSON-RPC, and servers run either locally, talking over standard input and output, or remotely over HTTP.

Adoption was fast. During 2025 OpenAI, Google and Microsoft added MCP support to their products, and thousands of MCP servers were published. In December 2025 Anthropic donated MCP to the new **Agentic AI Foundation** under the Linux Foundation, so it is now governed as an open industry standard. In practice you meet MCP when an assistant in a chat app or a code editor connects to your files, your company tools or a database, and when companies publish MCP servers so any AI tool can use their product. The questions it raises are about security: what a server is allowed to do, and whether text coming back from a tool can trick the model.`,
  diagram: {
    alt: "MCP architecture: a host application contains clients, each connected to one MCP server, and each server wraps a real system such as documents, a database or a ticketing tool.",
    caption: "**Write the connector once, use it everywhere.** The host talks to many servers through a standard protocol instead of custom wiring.",
    rows: [
      [{ id: "h", label: "Host", note: "chat app, IDE or agent", accent: "accent" }],
      [{ id: "c", label: "MCP clients", note: "one per server" }],
      [{ id: "s1", label: "Docs server", note: "tools + resources" }, { id: "s2", label: "Database server", note: "read-only queries" }, { id: "s3", label: "Ticket server", note: "create, update" }]
    ],
    edges: [{ from: "h", to: "c" }, { from: "c", to: "s1" }, { from: "c", to: "s2" }, { from: "c", to: "s3" }]
  }
},

{
  era: "2023 onwards",
  title: "Agents: models that plan and act",
  body: `Put an LLM, tools and a loop together and you get an **agent**. A normal LLM call is one question and one answer. An agent is given a goal and works towards it over several steps: it thinks about what to do, calls a tool, looks at the result, and decides the next step, until the goal is met or it gives up. That loop is essentially the ReAct pattern from the previous chapter.

For example, asked "which compressors had a high-temperature alarm last month, and what does the manual say to check?", an agent might query the maintenance database, pick out the compressors, search the manuals for each one, and then write a combined answer with sources. A plain RAG system does one search and one answer; an agent can decide it needs several.

The idea caught the public imagination in 2023 with experiments like AutoGPT, which tried to let a model pursue open-ended goals alone. They showed the promise and the problems: agents could wander, loop, burn through tokens and make confident mistakes. Practical agents since then are much more controlled. Frameworks such as **LangGraph** describe an agent as a graph of steps with explicit rules, and production agents have step limits, timeouts, clear tools with narrow permissions, and a human approval step before anything risky.

The honest rule of thumb: use a fixed workflow when you know the steps in advance, and an agent only when the steps genuinely depend on what the model discovers along the way. Agents are more flexible, but also slower, more expensive and harder to test.`
},

{
  era: "2024 onwards",
  title: "Teams of agents and orchestration",
  body: `Once single agents worked, the next idea was to split big jobs across several specialised agents, the way a company splits work across a team. One agent searches documents, another analyses data, another writes the report. This is a **multi-agent system**.

The most common arrangement is a **supervisor**: one agent receives the request, breaks it into tasks, hands each to a worker agent with the right tools, and combines their results. Other patterns include a hierarchy of supervisors for very large jobs, and **handoffs**, where one agent passes the conversation to another that is better suited. The software that decides which agent runs, in what order, what information they share, and what happens when one fails is called **orchestration**.

Agents built by different teams or companies also need a common way to talk. In April 2025 Google announced the **Agent2Agent protocol** (**A2A**), now also governed by the Linux Foundation, which lets agents advertise what they can do and delegate tasks to each other. A simple way to remember the two standards: **MCP connects an agent to tools and data; A2A connects agents to other agents.**

Multi-agent systems are powerful but easy to overuse. Every extra agent adds model calls, delay, cost and new ways to fail, and passing context between agents loses information. Many problems that look like they need a team of agents are handled better by one well-designed agent with good tools, or by a fixed workflow. Teams of agents earn their place when the work really divides into independent specialities.`,
  diagram: {
    alt: "A supervisor agent receives a request, delegates tasks to a document agent, a data agent and a writer agent, and combines their results.",
    caption: "**A supervisor splits the job and combines the answers.** Worth it only when the work genuinely divides into specialities.",
    rows: [
      [{ id: "u", label: "User request" }],
      [{ id: "s", label: "Supervisor agent", note: "plans and delegates", accent: "accent" }],
      [{ id: "d", label: "Document agent", note: "search manuals" }, { id: "t", label: "Data agent", note: "query records" }, { id: "w", label: "Writer agent", note: "draft the report" }]
    ],
    edges: [{ from: "u", to: "s" }, { from: "s", to: "d" }, { from: "s", to: "t" }, { from: "s", to: "w" }]
  }
},

{
  era: "The thread through it all",
  title: "One story, from least squares to agents",
  body: `Step back and the whole history is one chain of problems and solutions. Each invention fixed the biggest limit of the one before, and created the next problem.

- Measurements were noisy, so statisticians learned to fit lines and test whether patterns were real.
- Businesses needed predictions, so regression, classification and forecasting models appeared.
- Hand-built models couldn't capture complex patterns, so machines learned them from data: trees, boosting, and then neural networks.
- Neural networks needed data and compute, and when GPUs and the internet supplied both, deep learning conquered images.
- Language is a sequence, so RNNs and LSTMs read it in order, but they were slow and forgetful.
- Encoder-decoder models squeezed meaning through a single vector, so attention let them look back.
- Recurrence was the bottleneck, so the transformer kept only attention and trained in parallel.
- The transformer split into encoders that understand (BERT) and decoders that write (GPT), and scaling the decoder produced ChatGPT.
- LLMs don't know recent, private or personal facts, so RAG hands them the right documents at question time.
- LLMs can't act, so tool calling lets them use functions, and MCP standardised how tools are connected.
- One call isn't enough for multi-step goals, so agents loop through tools, and teams of agents divide bigger jobs under orchestration.

> **How to use this in an interview:** when you're asked about any one of these, place it in the chain. Say what problem came before it, what it solved, and what limit it still has. That single habit is what makes an answer sound like understanding rather than memory.`,
  diagram: {
    kind: "lanes",
    alt: "The timeline from statistics to agents: least squares and ANOVA, machine learning, deep learning, LSTMs, the transformer, ChatGPT, RAG and tools, and MCP with agents.",
    caption: "**Each step fixed the last one's biggest limit.** Knowing the chain lets you place any interview question in context.",
    lanes: [
      { label: "Statistics", note: "1805 to 1970" },
      { label: "Machine learning", note: "1959 to 2014" },
      { label: "Deep learning", note: "2012, AlexNet" },
      { label: "RNN and LSTM", note: "1990 to 2015" },
      { label: "Transformer", note: "2017", accent: "accent" },
      { label: "ChatGPT", note: "Nov 2022" },
      { label: "RAG and tools", note: "2020 to 2023" },
      { label: "MCP and agents", note: "2024 onwards" }
    ]
  }
}

  ]
};
