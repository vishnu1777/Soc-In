import Post from "../models/Post.js";
import User from "../models/User.js";
/* Create */
export const createPost = async (req, res) => {
  try {
    /* Creating a new post */
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      locaton: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    /* getting all the post from the Post table */
    const post = await Post.find();
    /* sending all the post information */
    res.status(201).json(post);
  } catch (e) {
    res.status(409).json({ error: e.message });
  }
};

/* Read */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    /* sending all the post information */
    res.status(200).json(post);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    /* grab only user posts from userId */
    const { userId } = req.params;
    const post = await Post.find({ userId });
    /* sending all the post information */
    res.status(200).json(post);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

/* Update */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    /* checiking if it is already liked or not */
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    /* get the newly updated posts or update it  */
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};
