document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const loadFeed = async () => {
        try {
            // For Demo: Loading all posts or just following. Let's load feed.
            const posts = await apiFetch('/feed');
            const container = document.getElementById('feedContainer');
            container.innerHTML = '';

            posts.forEach(post => {
                const isLiked = post.likes.includes(currentUser.id);
                const likeCount = post.likes.length;
                
                const card = document.createElement('div');
                card.className = 'card post-card';
                card.innerHTML = `
                    <div class="post-header">
                        <div class="post-author">
                            <div class="post-avatar" style="background-color: var(--accent)">${post.user.name.charAt(0)}</div>
                            <div>
                                <h4 style="margin: 0;">${post.user.name}</h4>
                                <p style="margin: 0; font-size: 0.8rem; color: var(--text-light);">${new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        ${post.user._id !== currentUser.id ? `<button class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;" onclick="followUser('${post.user._id}', this)">Follow</button>` : ''}
                    </div>
                    <div style="font-size: 1rem; color: var(--text-dark); margin: 0.5rem 0;">
                        ${post.content}
                    </div>
                    <div class="post-actions">
                        <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post._id}', this)">
                            <i class="fa-solid fa-heart"></i> <span>${likeCount}</span> Likes
                        </button>
                        <button class="post-action-btn" onclick="toggleComments('${post._id}')">
                            <i class="fa-regular fa-comment"></i> Comments
                        </button>
                    </div>
                    <div id="comments-${post._id}" class="comments-section">
                        <div id="comment-list-${post._id}" style="margin-bottom: 1rem;">
                            <!-- Comments dynamic -->
                        </div>
                        <form onsubmit="addComment(event, '${post._id}')" style="display: flex; gap: 0.5rem;">
                            <input type="text" class="form-control" placeholder="Add a comment..." required style="padding: 0.5rem;">
                            <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1rem;">Send</button>
                        </form>
                    </div>
                `;
                container.appendChild(card);
            });

        } catch (err) {
            console.error(err);
        }
    };

    loadFeed();

    document.getElementById('createPostForm').addEventListener('submit', async(e) => {
        e.preventDefault();
        const content = document.getElementById('postContent').value;
        try {
            await apiFetch('/posts', {
                method: 'POST',
                body: JSON.stringify({ content })
            });
            document.getElementById('postContent').value = '';
            loadFeed();
        } catch(err) { alert(err.message); }
    });

    // Make functions global to be called from inline onclick
    window.toggleLike = async (postId, btn) => {
        try {
            const likes = await apiFetch(`/posts/${postId}/like`, { method: 'PUT' });
            const span = btn.querySelector('span');
            span.innerText = likes.length;
            btn.classList.toggle('liked');
        } catch (err) { console.error(err); }
    };

    window.toggleComments = async (postId) => {
        const section = document.getElementById(`comments-${postId}`);
        if(section.style.display === 'block') {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
            // Load comments
            const list = document.getElementById(`comment-list-${postId}`);
            const comments = await apiFetch(`/posts/${postId}/comments`);
            list.innerHTML = comments.map(c => `
                <div class="comment">
                    <strong style="color: var(--primary)">${c.user.name}:</strong> <span>${c.text}</span>
                </div>
            `).join('');
        }
    };

    window.addComment = async (e, postId) => {
        e.preventDefault();
        const input = e.target.querySelector('input');
        try {
            await apiFetch(`/posts/${postId}/comments`, {
                method: 'POST',
                body: JSON.stringify({ text: input.value })
            });
            input.value = '';
            // Reload comments visually by refetching
            toggleComments(postId); // hide
            toggleComments(postId); // show & load
        } catch(err) { console.error(err); }
    }

    window.followUser = async (userId, btn) => {
        try {
            const res = await apiFetch(`/users/${userId}/follow`, { method: 'POST' });
            if(res.msg === 'Followed') {
                btn.innerText = 'Unfollow';
                btn.style.backgroundColor = '#e5e7eb';
                btn.style.color = '#1A1A1A';
            } else {
                btn.innerText = 'Follow';
                btn.style.backgroundColor = 'var(--primary)';
                btn.style.color = 'white';
            }
        } catch(err) {}
    }
});
