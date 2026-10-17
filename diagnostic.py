#!/usr/bin/env python3
import pandas as pd

# define functions

def clamp(value, min_value, max_value):
    return max(min_value, min(value, max_value))

def calc_stats(recognized):
    p_hat = recognized / n
    MoE = z * ((p_hat * (1 - p_hat) / n) ** 0.5)

    num = p_hat * N
    error = MoE * N

    status = 0
    if num < 10: # less than 10 correct
        status = 1
    if N - num < 10: # less than 10 incorrect
        status = 2

    return num, error, status

# constants

z = 1.96 # 95% confidence level
n = clamp(int(input("Sample size [1-1000]: ")), 1, 1000)
N = clamp(int(input(f"Population size [{n}-9933]: ")), n, 9933)

df = pd.read_csv("data/CharFreq.tsv", sep="\t")
mod_df = df.sort_values(by="raw_freq", ascending=False).head(N).sample(n)

recognize = 0
i = 0
print("Enter the character's pinyin (e.g. ni3 hao3)")
for index, row in mod_df.iterrows():
    i += 1
    print(f"#{i}/{n}", row["char"], end=" ")

    if input() in row["pinyin"].split("/"):
        print("Correct")
        recognize += 1
    else:
        print("Incorrect, should be", row["pinyin"])

num, error, status = calc_stats(recognize)
print(f"Score: {recognize}/{n}")
print(f"Estimated vocab: {num:.0f} ± {error:.0f} characters.")

if status == 1:
    print("Warning: The estimate may be inaccurate. Please decrease your population size.")
elif status == 2:
    print("Warning: The estimate may be inaccurate. Please increase your population size.")
