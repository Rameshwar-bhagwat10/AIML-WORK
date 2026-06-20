-- Seeding roadmap_months
insert into public.roadmap_months (month, title, goal) values
(1, 'Python', 'Get comfortable with Python fundamentals and write code daily'),
(2, 'Mathematics for AI', 'Build strong mathematical intuition'),
(3, 'Machine Learning', 'Build ML models end-to-end'),
(4, 'Deep Learning', 'Understand neural networks'),
(5, 'Generative AI', 'Build real GenAI apps'),
(6, 'Job Preparation', 'Prepare for job applications')
on conflict (month) do update set title = excluded.title, goal = excluded.goal;

-- Seeding roadmap_weeks
insert into public.roadmap_weeks (month, week, topics, tools, daily_practice, project, tip, difficulty, resources) values
-- Month 1
(1, 1, array['Variables & data types', 'Input/output', 'If-else', 'Loops', 'Lists, tuples, sets', 'Strings'], array['Python 3.11+', 'Google Colab', 'VS Code'], 'Solve 2 easy problems daily on HackerRank', 'Simple calculator', 'Avoid local setup, use Colab', 'beginner', '[{"title": "Python for Beginners", "url": "https://www.python.org/about/gettingstarted/"}]'::jsonb),
(1, 2, array['Functions', 'Scope', 'List comprehensions', 'File handling', 'Error handling', 'Modules'], array['Python stdlib'], 'Write every concept as function', 'Student grade calculator', 'Repeat list comprehensions', 'beginner', '[{"title": "Python Functions Guide", "url": "https://docs.python.org/3/tutorial/controlflow.html#defining-functions"}]'::jsonb),
(1, 3, array['NumPy', 'Pandas', 'Data cleaning', 'Groupby', 'Missing values'], array['NumPy', 'Pandas', 'Kaggle'], 'Analyze CSV daily', 'IPL dataset analysis', 'Data cleaning is core ML skill', 'intermediate', '[{"title": "Pandas Tutorial", "url": "https://pandas.pydata.org/docs/user_guide/10min.html"}]'::jsonb),
(1, 4, array['Matplotlib', 'Seaborn', 'EDA', 'Visualization'], array['Matplotlib', 'Seaborn'], 'Create 5 charts daily', 'Zomato/COVID analysis', 'Charts must tell story', 'intermediate', '[{"title": "Seaborn Gallery", "url": "https://seaborn.pydata.org/examples/index.html"}]'::jsonb),

-- Month 2
(2, 1, array['Mean', 'Variance', 'Percentiles', 'Normal distribution', 'Skewness', 'Correlation'], array['NumPy', 'Pandas'], 'Apply stats on datasets', 'Stock market analysis', 'Master standard deviation', 'intermediate', '[{"title": "Descriptive Statistics", "url": "https://en.wikipedia.org/wiki/Descriptive_statistics"}]'::jsonb),
(2, 2, array['Probability', 'Conditional probability', 'Bayes', 'Distributions'], array['scipy', 'Matplotlib'], 'Manual probability calculations', 'Spam classifier', 'Focus on intuition', 'intermediate', '[{"title": "Introduction to Probability", "url": "https://en.wikipedia.org/wiki/Probability"}]'::jsonb),
(2, 3, array['Vectors', 'Matrices', 'Dot product'], array['NumPy'], 'Watch 3Blue1Brown', 'Recommendation system', 'Everything is matrices', 'intermediate', '[{"title": "3Blue1Brown Linear Algebra", "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab"}]'::jsonb),
(2, 4, array['Functions', 'Derivatives', 'Gradient', 'Gradient descent'], array['NumPy', 'Matplotlib'], 'Visual learning', 'Gradient descent project', 'Core of deep learning', 'advanced', '[{"title": "Calculus for Deep Learning", "url": "https://en.wikipedia.org/wiki/Differential_calculus"}]'::jsonb),

-- Month 3
(3, 1, array['ML basics', 'Linear regression', 'Loss functions'], array['Scikit-learn'], 'Train simple models', 'House price prediction', 'Start simple', 'intermediate', '[{"title": "Scikit-Learn Docs", "url": "https://scikit-learn.org/stable/"}]'::jsonb),
(3, 2, array['Classification', 'Logistic regression', 'KNN'], array['Scikit-learn'], 'Analyze confusion matrix', 'Loan prediction', 'Accuracy is misleading', 'intermediate', '[{"title": "Classification Metrics", "url": "https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics"}]'::jsonb),
(3, 3, array['Trees', 'Random forest', 'XGBoost'], array['XGBoost'], 'Check feature importance', 'Fraud detection', 'Explainability matters', 'advanced', '[{"title": "XGBoost Tutorial", "url": "https://xgboost.readthedocs.io/en/stable/tutorials/index.html"}]'::jsonb),
(3, 4, array['Feature engineering', 'Scaling', 'Clustering', 'PCA'], array['Scikit-learn'], 'Engineer features', 'Customer segmentation', 'Features > models', 'advanced', '[{"title": "Dimensionality Reduction", "url": "https://scikit-learn.org/stable/modules/unsupervised_dimensionality_reduction.html"}]'::jsonb),

-- Month 4
(4, 1, array['Neurons', 'Backprop', 'Training'], array['PyTorch'], 'Build training loop', 'MNIST classifier', 'Watch overfitting', 'advanced', '[{"title": "PyTorch Tutorial", "url": "https://pytorch.org/tutorials/"}]'::jsonb),
(4, 2, array['CNN', 'Transfer learning'], array['PyTorch', 'torchvision'], 'Use pretrained models', 'Food classifier', 'Don’t train from scratch', 'advanced', '[{"title": "CNN Explainer", "url": "https://poloclub.github.io/cnn-explainer/"}]'::jsonb),
(4, 3, array['NLP', 'BERT', 'Embeddings'], array['HuggingFace'], 'Read docs', 'Fake news detector', 'Indian NLP gives edge', 'advanced', '[{"title": "Hugging Face Course", "url": "https://huggingface.co/course/"}]'::jsonb),
(4, 4, array['Transformers', 'Deployment'], array['Gradio', 'Streamlit'], 'Deploy models', 'Sentiment analyzer', 'Deployment matters', 'advanced', '[{"title": "Model Deployment in Gradio", "url": "https://gradio.app/docs/"}]'::jsonb),

-- Month 5
(5, 1, array['LLMs', 'Prompting'], array['OpenAI API'], 'Write prompts', 'Chatbot', 'Clear prompts win', 'intermediate', '[{"title": "OpenAI API Reference", "url": "https://platform.openai.com/docs/api-reference"}]'::jsonb),
(5, 2, array['RAG', 'Embeddings', 'Vector DB'], array['LangChain', 'ChromaDB'], 'Debug retrieval', 'RAG bot', 'Chunking matters', 'advanced', '[{"title": "LangChain Documentation", "url": "https://js.langchain.com/docs/get_started/introduction"}]'::jsonb),
(5, 3, array['Agents', 'Tool calling'], array['LangChain'], 'Test edge cases', 'Research agent', 'Agents give edge', 'advanced', '[{"title": "AI Agents Guide", "url": "https://en.wikipedia.org/wiki/Software_agent"}]'::jsonb),
(5, 4, array['FastAPI', 'Deployment'], array['Docker', 'Streamlit'], 'Deploy apps', 'AI support bot', 'Protect API keys', 'advanced', '[{"title": "Dockerizing FastAPI", "url": "https://fastapi.tiangolo.com/deployment/docker/"}]'::jsonb),

-- Month 6
(6, 1, array['Resume', 'GitHub'], array['Canva', 'Overleaf'], 'Improve resume daily', 'Final resume', 'Numbers matter', 'beginner', '[{"title": "Resume Writing Tips", "url": "https://en.wikipedia.org/wiki/Resume"}]'::jsonb),
(6, 2, array['LinkedIn', 'Applications'], array['LinkedIn'], 'Post weekly', 'Profile setup', 'Cold outreach works', 'beginner', '[{"title": "LinkedIn Profile Best Practices", "url": "https://linkedin.com"}]'::jsonb),
(6, 3, array['Revision', 'SQL', 'System design'], array['LeetCode'], 'Explain concepts', 'System design answers', 'Explain clearly', 'intermediate', '[{"title": "LeetCode SQL Problems", "url": "https://leetcode.com/problemset/database/"}]'::jsonb),
(6, 4, array['Interviews', 'Applications'], array['Glassdoor'], 'Apply daily', 'Job tracking', 'Rejections = feedback', 'intermediate', '[{"title": "Tech Interview Handbook", "url": "https://techinterviewhandbook.org/"}]'::jsonb)
on conflict (month, week) do update set 
  topics = excluded.topics, 
  tools = excluded.tools, 
  daily_practice = excluded.daily_practice, 
  project = excluded.project, 
  tip = excluded.tip,
  difficulty = excluded.difficulty,
  resources = excluded.resources;

-- Seeding roadmap_tasks
insert into public.roadmap_tasks (month, week, day, title, task_order) values
-- MONTH 1: Python
-- Month 1 Week 1
(1, 1, 1, 'Understand Python variables, dynamic typing, and memory assignment references', 1),
(1, 1, 1, 'Explore core primitive data types: integers, floats, booleans, and character strings', 2),
(1, 1, 2, 'Master standard console input/output functions, including print formatting and input parsing', 1),
(1, 1, 3, 'Implement control flow conditional structures using if, elif, and else statements', 1),
(1, 1, 4, 'Master iterative loops (for, while) along with control keywords (break, continue)', 1),
(1, 1, 5, 'Work with linear collection types: lists (mutable arrays) and tuples (immutable sequences)', 1),
(1, 1, 6, 'Master string operations, concatenation, indexing, slicing, and built-in functions', 1),
(1, 1, 7, 'Build a terminal-based arithmetic calculator project applying loops and conditionals', 1),

-- Month 1 Week 2
(1, 2, 1, 'Declare functions, define positional/keyword arguments, default parameters, and return statements', 1),
(1, 2, 2, 'Study namespaces and local, global, nonlocal scope rules (the LEGB lookup precedence)', 1),
(1, 2, 3, 'Write elegant list, dictionary, and set comprehensions for clean data transformations', 1),
(1, 2, 4, 'Perform file reading and writing operations using context managers (the with block)', 1),
(1, 2, 5, 'Handle runtime exceptions using try, except, else, and finally blocks safely', 1),
(1, 2, 6, 'Import standard libraries and install/manage third-party packages using pip tools', 1),
(1, 2, 7, 'Build a student grade calculator project storing reports in local text files', 1),

-- Month 1 Week 3
(1, 3, 1, 'Understand NumPy multi-dimensional arrays (ndarrays), creation methods, and shapes', 1),
(1, 3, 2, 'Perform statistical math computations (mean, median, std) on arrays using vectorized NumPy methods', 1),
(1, 3, 3, 'Understand Pandas core structures: Series and DataFrame tables, indices, and selectors', 1),
(1, 3, 4, 'Load datasets from external files (CSV, JSON, Excel) and explore profiles using head/info', 1),
(1, 3, 5, 'Filter rows dynamically using conditional expressions and boolean index masks', 1),
(1, 3, 6, 'Detect null values and clean data using removal (dropna) and imputation (fillna) methods', 1),
(1, 3, 7, 'Build an IPL dataset analysis pipeline calculating team rankings and player metrics', 1),

-- Month 1 Week 4
(1, 4, 1, 'Draw basic line graphs, scatter plots, bar charts, and histograms using Matplotlib', 1),
(1, 4, 2, 'Draw statistical graphs, box plots, heatmaps, and pair plots using Seaborn themes', 1),
(1, 4, 3, 'Execute Exploratory Data Analysis (EDA) to map distributions, shapes, and anomalies', 1),
(1, 4, 4, 'Calculate Pearson correlation coefficients and generate correlation heatmaps', 1),
(1, 4, 5, 'Add clear chart annotations, customize legends, color palettes, and axis titles', 1),
(1, 4, 6, 'Complete visual analysis practices on complex datasets to extract structural patterns', 1),
(1, 4, 7, 'Analyze COVID-19 case metrics or Zomato restaurant review distributions project', 1),

-- MONTH 2: Mathematics for AI
-- Month 2 Week 1
(2, 1, 1, 'Calculate descriptive central tendency indices (mean, median, mode) and analyze outlier impact', 1),
(2, 1, 2, 'Compute dispersion parameters: variance, standard deviation, and data ranges', 1),
(2, 1, 3, 'Calculate percentiles, quantiles, and IQR boundaries to detect outliers', 1),
(2, 1, 4, 'Study the Normal distribution, bell curves, and standard score (z-score) conversions', 1),
(2, 1, 5, 'Evaluate asymmetry in data distributions, measuring positive and negative skewness', 1),
(2, 1, 6, 'Measure correlation metrics and build scatter plots to study variable dependencies', 1),
(2, 1, 7, 'Perform statistics analysis on stock market index returns project', 1),

-- Month 2 Week 2
(2, 2, 1, 'Define probability spaces, mutually exclusive events, intersections, and unions', 1),
(2, 2, 2, 'Understand conditional probability, joint probability, and product rules', 1),
(2, 2, 3, 'Master Bayes Theorem calculations (prior, likelihood, posterior probabilities) for classification', 1),
(2, 2, 4, 'Compare discrete and continuous probability distributions (PDF, PMF, CDF)', 1),
(2, 2, 5, 'Model binary events using Bernoulli trials and compile Binomial distribution math', 1),
(2, 2, 6, 'Apply Naive Bayes mathematical logic to spam email text classification rules', 1),
(2, 2, 7, 'Build a Naive Bayes spam classifier prototype from scratch in Python', 1),

-- Month 2 Week 3
(2, 3, 1, 'Learn vector definitions, vector additions, scaling, and geometric spaces', 1),
(2, 3, 2, 'Compute vector dot products, projections, and evaluate cosine similarity metrics', 1),
(2, 3, 3, 'Define matrices, operations, addition, and scalar multiplications', 1),
(2, 3, 4, 'Master matrix-matrix multiplication rules, shapes, and properties', 1),
(2, 3, 5, 'Calculate matrix transpositions, determinants, and matrix inverses', 1),
(2, 3, 6, 'Trace linear algebra activations (Wx + b) representing dense layers inside networks', 1),
(2, 3, 7, 'Build a basic collaborative filtering recommendation system project using matrix multiplication', 1),

-- Month 2 Week 4
(2, 4, 1, 'Examine linear, quadratic, exponential functions, and mathematical boundaries', 1),
(2, 4, 2, 'Calculate rates of change, tangents, and understand slopes of functions', 1),
(2, 4, 3, 'Compute derivatives using power, product, quotient, and chain rules', 1),
(2, 4, 4, 'Form gradient vectors by calculating partial derivatives of multivariable equations', 1),
(2, 4, 5, 'Trace gradient descent iterations, learning steps, and optimization paths', 1),
(2, 4, 6, 'Evaluate learning rate impacts, overshooting, and convergence limits', 1),
(2, 4, 7, 'Write a gradient descent parameter optimization script from scratch in Python', 1),

-- MONTH 3: Machine Learning
-- Month 3 Week 1
(3, 1, 1, 'Understand supervised vs unsupervised learning paradigms and ML pipeline structures', 1),
(3, 1, 2, 'Implement simple linear regression and multiple linear regression models', 1),
(3, 1, 3, 'Define cost functions: Mean Squared Error (MSE) and Mean Absolute Error (MAE)', 1),
(3, 1, 4, 'Perform train/test splits and understand bias-variance trade-offs', 1),
(3, 1, 5, 'Measure model fits using R-squared and Adjusted R-squared scores', 1),
(3, 1, 6, 'Prevent overfitting using L1 (Lasso) and L2 (Ridge) regression regularizers', 1),
(3, 1, 7, 'Train and evaluate a house price prediction model project', 1),

-- Month 3 Week 2
(3, 2, 1, 'Understand classification boundaries, binary tasks, and multiclass targets', 1),
(3, 2, 2, 'Train Logistic Regression models using sigmoid probabilities', 1),
(3, 2, 3, 'Implement K-Nearest Neighbors (KNN) classifier and tune distance parameters', 1),
(3, 2, 4, 'Evaluate predictions using Confusion Matrices (TP, FP, TN, FN)', 1),
(3, 2, 5, 'Evaluate model quality using Precision, Recall, Accuracy, and F1-score metrics', 1),
(3, 2, 6, 'Plot Receiver Operating Characteristic (ROC) curves and calculate Area Under Curve (AUC)', 1),
(3, 2, 7, 'Build a classification pipeline predicting loan approval outcomes', 1),

-- Month 3 Week 3
(3, 3, 1, 'Understand Decision Trees, Gini impurity, entropy, and Information Gain', 1),
(3, 3, 2, 'Address tree overfitting using max depth and min samples split constraints', 1),
(3, 3, 3, 'Implement Random Forest ensemble bagging classifiers', 1),
(3, 3, 4, 'Learn boosting algorithms, Gradient Boosting, and run XGBoost models', 1),
(3, 3, 5, 'Extract and plot relative feature importances from ensemble models', 1),
(3, 3, 6, 'Validate model generalizability using K-Fold cross-validation', 1),
(3, 3, 7, 'Build a credit card fraud detection system project using ensemble models', 1),

-- Month 3 Week 4
(3, 4, 1, 'Apply data preprocessing, feature engineering, and selection strategies', 1),
(3, 4, 2, 'Map categorical data using One-Hot encoding and label encoding schemas', 1),
(3, 4, 3, 'Standardize numerical features using StandardScaler and MinMaxScaler tools', 1),
(3, 4, 4, 'Implement K-Means clustering and find optimal cluster counts using the elbow method', 1),
(3, 4, 5, 'Understand Principal Component Analysis (PCA) for dimensionality reduction', 1),
(3, 4, 6, 'Tune model hyperparameters using GridSearchCV and RandomizedSearchCV sweeps', 1),
(3, 4, 7, 'Group customers dynamically using PCA and K-Means segmentation project', 1),

-- MONTH 4: Deep Learning
-- Month 4 Week 1
(4, 1, 1, 'Model artificial neurons, weights, biases, and activation functions (ReLU, Sigmoid)', 1),
(4, 1, 2, 'Perform forward pass matrix operations in dense fully-connected network layers', 1),
(4, 1, 3, 'Define loss objectives: Binary Cross-Entropy and Categorical Cross-Entropy', 1),
(4, 1, 4, 'Trace backpropagation algorithms, calculating gradients with the chain rule', 1),
(4, 1, 5, 'Implement standard training loops using epochs, batch updates, and gradients resets', 1),
(4, 1, 6, 'Accelerate neural network training using Adam, SGD, and RMSprop optimizers', 1),
(4, 1, 7, 'Train a multi-layer perceptron classifying MNIST handwritten digits project', 1),

-- Month 4 Week 2
(4, 2, 1, 'Understand Convolutional Neural Networks (CNNs), receptive fields, and weight sharing', 1),
(4, 2, 2, 'Apply convolution filter kernels, padding, strides, and feature maps', 1),
(4, 2, 3, 'Perform spatial dimension reduction using Max Pooling and Average Pooling', 1),
(4, 2, 4, 'Load pre-trained models, freeze baseline weights, and add custom head layers', 1),
(4, 2, 5, 'Analyze ResNet residual blocks, skip connections, and address vanishing gradients', 1),
(4, 2, 6, 'Study compound scaling logic inside modern EfficientNet models', 1),
(4, 2, 7, 'Build a food image classifier using ResNet transfer learning project', 1),

-- Month 4 Week 3
(4, 3, 1, 'Understand NLP preprocessing pipelines: stemming, lemmatization, and stop-word removal', 1),
(4, 3, 2, 'Tokenize text using whitespace splits, WordPiece, and BPE algorithms', 1),
(4, 3, 3, 'Map words to vector spaces using Word2Vec and GloVe embeddings', 1),
(4, 3, 4, 'Study BERT transformer architecture and bidirectional context representation', 1),
(4, 3, 5, 'Explore HuggingFace pre-trained models and generation pipelines', 1),
(4, 3, 6, 'Configure fine-tuning hyperparameters for text classification models', 1),
(4, 3, 7, 'Fine-tune a pre-trained BERT model to detect fake news articles project', 1),

-- Month 4 Week 4
(4, 4, 1, 'Study Transformer architecture and Self-Attention concepts', 1),
(4, 4, 2, 'Master Self-Attention, Multi-Head Attention, and positional encodings', 1),
(4, 4, 3, 'Compare Encoder-only, Decoder-only, and Encoder-Decoder architectures', 1),
(4, 4, 4, 'Evaluate generated text quality using BLEU and ROUGE scoring benchmarks', 1),
(4, 4, 5, 'Serve Deep Learning models using high-performance inference serving platforms', 1),
(4, 4, 6, 'Deploy Deep Learning models inside containerized FastAPI servers', 1),
(4, 4, 7, 'Build and deploy a real-time text sentiment analyzer project', 1),

-- MONTH 5: Generative AI
-- Month 5 Week 1
(5, 1, 1, 'Understand autoregressive language models, pre-training, SFT, and alignment loops', 1),
(5, 1, 2, 'Analyze token costs, context window limits, and temperature/top-p parameters', 1),
(5, 1, 3, 'Connect client applications to OpenAI, Anthropic, or Gemini APIs', 1),
(5, 1, 4, 'Master writing system prompts and context constraints for LLMs', 1),
(5, 1, 5, 'Apply prompt engineering strategies: chain-of-thought and structural prompts', 1),
(5, 1, 6, 'Optimize output quality using zero-shot, one-shot, and few-shot in-context learning', 1),
(5, 1, 7, 'Build an interactive chatbot with session context memory project', 1),

-- Month 5 Week 2
(5, 2, 1, 'Understand Retrieval-Augmented Generation (RAG) concepts and knowledge databases', 1),
(5, 2, 2, 'Generate text vector embeddings for document chunk indexing', 1),
(5, 2, 3, 'Configure vector databases (ChromaDB, pgvector) for document chunk searches', 1),
(5, 2, 4, 'Perform document chunking using character, recursive, and sentence splits', 1),
(5, 2, 5, 'Execute similarity searches using Cosine Similarity metrics', 1),
(5, 2, 6, 'Build a RAG pipeline combining retrieval and prompt generation', 1),
(5, 2, 7, 'Build a document-based Q&A chatbot using a custom RAG pipeline project', 1),

-- Month 5 Week 3
(5, 3, 1, 'Understand AI Agent architectures, planning, profiling, and action loops', 1),
(5, 3, 2, 'Master function calling, JSON output schemas, and API tool descriptors', 1),
(5, 3, 3, 'Implement the ReAct (Reasoning and Action) loop pattern in agent execution', 1),
(5, 3, 4, 'Persist conversation history and agent variables across workspace steps', 1),
(5, 3, 5, 'Design agents coordinating multiple tools: search, calculator, and databases', 1),
(5, 3, 6, 'Address agent failures: formatting issues, token limits, and infinite loops', 1),
(5, 3, 7, 'Build an automated research agent that synthesizes info from search tools project', 1),

-- Month 5 Week 4
(5, 4, 1, 'Develop high-performance REST APIs using FastAPI routes and decorators', 1),
(5, 4, 2, 'Validate request/response schemas using Pydantic types', 1),
(5, 4, 3, 'Write Dockerfiles, build container images, and test containerized APIs locally', 1),
(5, 4, 4, 'Deploy GenAI containers to cloud platforms (AWS, GCP, or Render)', 1),
(5, 4, 5, 'Secure API keys and database credentials using environment variables', 1),
(5, 4, 6, 'Write automated tests for FastAPI routes and endpoints', 1),
(5, 4, 7, 'Build and deploy an automated customer support chatbot API project', 1),

-- MONTH 6: Job Preparation
-- Month 6 Week 1
(6, 1, 1, 'Design a technical resume optimized for Applicant Tracking Systems (ATS)', 1),
(6, 1, 2, 'Structure ML project descriptions highlighting quantitative metrics (e.g. accuracy increase)', 1),
(6, 1, 3, 'List technical proficiencies, programming languages, and cloud frameworks strategically', 1),
(6, 1, 4, 'Organize portfolio projects on GitHub with public access permissions', 1),
(6, 1, 5, 'Write professional README documentation showing architectures, setup steps, and results', 1),
(6, 1, 6, 'Build a clean portfolio page showcasing key deliverables and live project demos', 1),
(6, 1, 7, 'Review, polish, and export the resume to PDF format', 1),

-- Month 6 Week 2
(6, 2, 1, 'Optimize LinkedIn profile for recruiter searches', 1),
(6, 2, 2, 'Write technical posts and share project walk-throughs on social channels', 1),
(6, 2, 3, 'Publish tech insights, tutorials, and engage with community posts', 1),
(6, 2, 4, 'Draft professional cold emails and outreach messages to tech leads', 1),
(6, 2, 5, 'Find and apply to relevant roles daily', 1),
(6, 2, 6, 'Connect with industry professionals and request informational interviews', 1),
(6, 2, 7, 'Maintain a spreadsheet tracker mapping contacts, responses, and interview steps', 1),

-- Month 6 Week 3
(6, 3, 1, 'Revise core ML algorithm theories, bias-variance tradeoffs, and tuning parameters', 1),
(6, 3, 2, 'Solve complex data manipulation, aggregation, and merging problems in Pandas', 1),
(6, 3, 3, 'Write SQL queries covering joins, groupings, window functions, and CTEs', 1),
(6, 3, 4, 'Study ML system design: pipeline scaling, feature stores, and data drift', 1),
(6, 3, 5, 'Examine business case studies mapping user actions to ML model evaluation targets', 1),
(6, 3, 6, 'Schedule mock interviews with peers focusing on system design and coding', 1),
(6, 3, 7, 'Practice answering behavioral questions using the structured STAR framework', 1),

-- Month 6 Week 4
(6, 4, 1, 'Perform full mock interviews covering system design, coding, and behavioral elements', 1),
(6, 4, 2, 'Review the technical details and architectures of all portfolio projects', 1),
(6, 4, 3, 'Practice self-introductions, elevator pitches, and walking through your resume', 1),
(6, 4, 4, 'Research salary ranges, benefits packages, and negotiation strategies', 1),
(6, 4, 5, 'Analyze mock interview feedback and make adjustments to key responses', 1),
(6, 4, 6, 'Submit daily job applications and follow up on active threads', 1),
(6, 4, 7, 'Review application status changes and perform final prep sweeps', 1);
