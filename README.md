# Decompressed Poems

aws s3 + cloudfront + deno deploy


Basically it's a simple static blog but with incremental generation capability


Store post data in one big JSON file and save it at s3. 
Handle create, delete, update post request through deno deploy and 
regenerate only the changed part (on new post update post list, create new post page)
update static files on s3.


By this structure it's free unless you have like thousands of posts. Also updates
can happen through the browser, unlike other github based static blogs 
where you have to push each time you update a post. hated it

## details

#### sitemap

```
+-- index: post list sorted by date, simple introduction of me
+-- posts: post list grouped by year
\-- api
	+-- POST   `/post`: create new post -> update index, posts, post/id
	+-- DELETE `/post/[id]`: delete post -> update index, posts, post/id
	+-- POST   `/post/[id]`: update post -> update index, posts, post/id
	+-- POST   `/thoughts`: create new thought -> update thoughts
	+-- DELETE `/thoughts/[id]`: delete thoguht -> update thoughts
\-- post
	+-- [id]: post
```

```typescript
type Post = {
	id: string,
	title: string,
	description: string,
	createdAt: string,
	updatedAt?: string,
	content: string,
}
```

#### router pattern matching

```
/post/123123 match /post/:id
/post/dsafdsa match /post/:id
/post/dsafd match /post/:id

/test/dsafdsa/dsa match /test/:a/:b
```
