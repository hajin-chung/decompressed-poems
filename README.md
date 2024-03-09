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

```
+-- index: post list sorted by date, simple introduction of me
+-- poems: my short thoughts
+-- posts: post list grouped by year
\-- post
	+-- [id]: post
\-- api
	+-- POST   `/post`: create new post -> update index, posts, post/id
	+-- DELETE `/post/[id]`: delete post -> update index, posts, post/id
	+-- POST   `/post/[id]`: update post -> update index, posts, post/id
	+-- POST   `/poem`: create new poem -> update poems
	+-- DELETE `/poem/[id]`: delete poem -> update poems
```

```typescript
type Post = {
	id: string,
	title: string,
	description: string,
	createdAt: string,
	updatedAt?: string,
	content: string,
};

type Poem = {
	id: string,
	content: string,
	createdAt: string,
};
```
