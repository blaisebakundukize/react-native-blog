import createDataContext from './createDataContext';
import jsonServer from '../api/jsonServer';

const blogReducer = (state, action) => {
  const id = state.length > 0 ? state[state.length - 1].id + 1 : 1

  switch (action.type) {
    case 'get_blogposts':
      return action.payload;
    // ----> Removed since we adding new post over the server
    // case 'add_blogpost':
    //   return [
    //     ...state,
    //     {
    //       id,
    //       title: action.payload.title,
    //       content: action.payload.content
    //     }];
    case 'delete_blogpost':
      return state.filter(blogPost => blogPost.id !== action.payload);
    case 'edit_blogpost':
      return state.map((blogPost) => {
        return blogPost.id === action.payload.id
          ? action.payload
          : blogPost;
      })
    default:
      return state;
  }
};

const getBlogPosts = dispatch => {
  return async () => {
    const response = await jsonServer.get('/blogposts');
    dispatch({ type: 'get_blogposts', payload: response.data });
  }
}

const addBlogPost = dispatch => {
  return async (title, content, callback) => {
    await jsonServer.post('/blogposts', { title, content });
    // dispatch({ type: 'add_blogpost', payload: { title, content } });
    if (callback) {
      callback();
    }
  };
};

const deleteBlogPost = dispatch => {
  return async (id) => {
    await jsonServer.delete(`/blogposts/${id}`);

    dispatch({ type: 'delete_blogpost', payload: id })
  };
};

const editBlogPost = dispatch => {
  return async (id, title, content, callback) => {
    await jsonServer.put(`/blogposts/${id}`, { title, content });

    dispatch({ type: 'edit_blogpost', payload: { id, title, content } });
    if (callback) {
      callback();
    }
  }
}

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
  []
);
