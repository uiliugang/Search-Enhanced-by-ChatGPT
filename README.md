# Search-Enhanced-by-ChatGPT

## completed function
- support search engine: bing, google, neeva. 
- If your searching content ends with '?' or '/', this script will send it as prompt to opanAI model and show the answer in the result page automatically.
- you can config your script settings: max_tokens model returns,position of answer container(0: innner, 1: right-side), temperature(float: 0-1, it means relevance) and model you called.

I have tested this script installed in tampermonkey for neeva, google and bing, it works well. 

## todo
- since chatgpt api is not released now, the script use an api-key of your openAI account to access their models. Because web access 
is not stable, the absolute version will be completed after api of chatgpt is available.

![](https://github.com/uiliugang/Search-Enhanced-by-ChatGPT/blob/5f58b421b2cd9230f33a499cf056bb5d7c100a6c/screenshots/google_1.png)
![](https://github.com/uiliugang/Search-Enhanced-by-ChatGPT/blob/5f58b421b2cd9230f33a499cf056bb5d7c100a6c/screenshots/google_2.png)
![](https://github.com/uiliugang/Search-Enhanced-by-ChatGPT/blob/5f58b421b2cd9230f33a499cf056bb5d7c100a6c/screenshots/neeva_1.png)
![](https://github.com/uiliugang/Search-Enhanced-by-ChatGPT/blob/5f58b421b2cd9230f33a499cf056bb5d7c100a6c/screenshots/neeva_2.png)
![](https://github.com/uiliugang/Search-Enhanced-by-ChatGPT/blob/5f58b421b2cd9230f33a499cf056bb5d7c100a6c/screenshots/bing_1.png)
![](https://github.com/uiliugang/Search-Enhanced-by-ChatGPT/blob/5f58b421b2cd9230f33a499cf056bb5d7c100a6c/screenshots/bing_2.png)



