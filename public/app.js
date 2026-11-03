const featuredEl = document.getElementById('featured-blogs');
const allBlogsEl = document.getElementById('all-blogs');
const usersEl = document.getElementById('users');
const authorSelect = document.getElementById('author-select');
const blogForm = document.getElementById('blog-form');
const userForm = document.getElementById('user-form');

let usersById = {};

function request(url, options = {}) {
    return fetch(url, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options))
        .then(res => {
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            return res.status === 204 ? null : res.json();
        });
}

function authorName(id) {
    const user = usersById[id];
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown author';
}

function renderBlog(blog) {
    const article = document.createElement('article');

    const title = document.createElement('h3');
    title.textContent = blog.title;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${authorName(blog.author)} · ${new Date(blog.published).toLocaleDateString()}`;

    const body = document.createElement('p');
    body.textContent = blog.article;

    const del = document.createElement('button');
    del.className = 'delete';
    del.textContent = 'Delete';
    del.addEventListener('click', () => {
        request(`/api/blogs/${blog._id}`, { method: 'DELETE' }).then(loadAll);
    });

    article.append(title, meta, body, del);
    return article;
}

function renderBlogs(el, blogs) {
    el.innerHTML = '';
    if (!blogs.length) {
        el.textContent = 'Nothing here yet.';
        return;
    }
    blogs.forEach(blog => el.appendChild(renderBlog(blog)));
}

function renderUsers(users) {
    usersEl.innerHTML = '';
    authorSelect.innerHTML = '';

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.firstName} ${user.lastName} (${user.email}) — ${user.blogs.length} blog(s) `;

        const del = document.createElement('button');
        del.className = 'delete';
        del.textContent = 'Delete';
        del.addEventListener('click', () => {
            request(`/api/users/${user._id}`, { method: 'DELETE' }).then(loadAll);
        });
        li.appendChild(del);
        usersEl.appendChild(li);

        const option = document.createElement('option');
        option.value = user._id;
        option.textContent = `${user.firstName} ${user.lastName}`;
        authorSelect.appendChild(option);
    });
}

function loadAll() {
    return request('/api/users')
        .then(users => {
            usersById = {};
            users.forEach(user => { usersById[user._id] = user; });
            renderUsers(users);

            return Promise.all([request('/api/blogs'), request('/api/blogs/featured')]);
        })
        .then(([blogs, featured]) => {
            renderBlogs(allBlogsEl, blogs);
            renderBlogs(featuredEl, featured);
        })
        .catch(err => console.error(err));
}

blogForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(blogForm);

    request('/api/blogs', {
        method: 'POST',
        body: JSON.stringify({
            author: data.get('author'),
            title: data.get('title'),
            article: data.get('article'),
            featured: data.get('featured') === 'on',
            published: Date.now()
        })
    })
        .then(() => {
            blogForm.reset();
            return loadAll();
        })
        .catch(err => alert(err.message));
});

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(userForm);

    request('/api/users', {
        method: 'POST',
        body: JSON.stringify({
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email')
        })
    })
        .then(() => {
            userForm.reset();
            return loadAll();
        })
        .catch(err => alert(err.message));
});

loadAll();
