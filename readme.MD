Redis Cache Demo
===================
Hey everyone, here is the code that I used for my live coding for my Tech Talk at FullStack Academy. 

This code is really meant for just understanding how it works! 

---------
Documents
-------------
> **What I have installed on my computer**

> - Redis
> - Sqlite IMDB database
> - **you wont be able to run this without either.**


Here is a roguh little diagram :D
```sequence
App->Redis: Do you hvae this dadta?
Redis->App: Yes/No
Note right of App:checks with Database 
App-->Database: Gimme data
Database-->App:Here is the data
```

