# Hanzi Vocabulary Diagnostic

Test to see how many Chinese characters you recognize!

## Instructions

1. Enter your sample size (n), which is the number of randomly selected characters that you will be tested on. For accuracy, I recommend a sample size of above 50.
2. Enter your population size (N). You will be tested on **n** randomly selected characters from the top **N** most common characters used in Chinese. So, the lower this number, the easier the difficulty, and the inverse is true. Common values are 100 (novice), 500 (beginner), 1000 (intermediate), 2000 (advanced), 3500 (fluent), 5000 (native), 10000 (状元).
3. Enter the pronounciation of each character in Pinyin, including tone numbers (1, 2, 3, 4). The neutral tone has no number marked after it.

## Datasets used

I used [Jun Da's (笪骏) datasets](https://lingua.mtsu.edu/chinese-computing/statistics/), which are publicly available. Specifically, I used the [Character Frequency List of Modern Chinese (现代汉语单字字频)](https://lingua.mtsu.edu/chinese-computing/statistics/char/list.php?Which=MO) made by him.

## Math explaination

The program estimates the real proportion of characters you recognize based on a sample proportion. It uses a 95% confidence interval and a one-proportion z-test to estimate the real proportion. Stuff I learned in AP Statistics.

## To do

- Turn UI into a flashcards type app instead of entering the pinyin
- Show both traditional and simplified