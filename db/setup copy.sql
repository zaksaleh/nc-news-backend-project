DROP DATABASE IF EXISTS nc_news_test;
DROP DATABASE IF EXISTS nc_news;

CREATE DATABASE nc_news_test;
CREATE DATABASE nc_news;


SELECT * FROM articles LEFT JOIN comments ON comments.article_id = articles.articles_id;