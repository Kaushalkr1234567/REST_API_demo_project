document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const postDetailsContainer = document.getElementById('post-details-container');
    const fetchPostsButton = document.getElementById('fetch-posts');

    fetchPostsButton.addEventListener('click', fetchPosts);

    async function fetchPosts() {
        try {
            const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
            const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
            
            const posts = await postsResponse.json();
            const users = await usersResponse.json();
            
            const usersMap = users.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {});
            
            displayPosts(posts, usersMap);
        } catch (error) {
            postsContainer.innerHTML = '<div class="error">Failed to load posts.</div>';
        }
    }

    function displayPosts(posts, usersMap) {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const user = usersMap[post.userId];
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <div class="user-info">Posted by: ${user.name} (${user.email})</div>
            `;
            postElement.addEventListener('click', () => fetchPostDetails(post.id));
            postsContainer.appendChild(postElement);
        });
    }

    async function fetchPostDetails(postId) {
        try {
            const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
            const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
            
            const post = await postResponse.json();
            const comments = await commentsResponse.json();
            
            displayPostDetails(post, comments);
        } catch (error) {
            postDetailsContainer.innerHTML = '<div class="error">Failed to load post details.</div>';
        }
    }

    function displayPostDetails(post, comments) {
        postDetailsContainer.classList.remove('hidden');
        postDetailsContainer.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <h3>Comments:</h3>
            ${comments.map(comment => `
                <div class="comment">
                    <p><strong>${comment.name}</strong> (${comment.email})</p>
                    <p>${comment.body}</p>
                </div>
            `).join('')}
        `;
    }
});
