const postModel = require('../models/postModel');

class postService {
  async getAllPosts() {
    const posts = await postModel.find().populate({
      path: 'user',
      select: ['name', 'surname', 'id', 'userAvatar'],
    });

    return posts;
  }

  async createPost(post) {
    const createdPost = new postModel({
      title: post.body.title,
      text: post.body.text,
      imageUrl: post.body.imageUrl,
      tags: post.body.tags,
      user: post.user.id,
    });

    const savedPost = await createdPost.save();

    return savedPost;
  }

  async getOnePost(id) {
    const getOne = await postModel
      .findByIdAndUpdate({ _id: id }, { $inc: { viewsCount: 1 } })
      .populate({
        path: 'user',
        select: ['name', 'surname', '_id', 'userAvatar'],
      })
      .populate({
        path: 'comments.user',
        select: ['name', 'surname', 'id', 'userAvatar'],
      });

    return getOne;
  }

  async deletePost(id) {
    const deleteOne = await postModel.findOneAndDelete({ _id: id });

    return deleteOne;
  }

  async updatePost(postId, post) {
    const updatePost = await postModel.findByIdAndUpdate(
      { _id: postId },
      {
        title: post.title,
        text: post.text,
        imageUrl: post.imageUrl,
        tags: post.tags,
        user: post.user,
      }
    );

    return updatePost;
  }

  async findPostByTag(name) {
    const findPosts = await postModel.find({ tags: name }).populate({
      path: 'user',
      select: ['name', 'surname', 'id', 'isActivated', 'email', 'userAvatar'],
    });

    return findPosts;
  }

  async getTags() {
    const tagsFromPosts = await postModel.aggregate([
      { $project: { tags: { $first: '$tags' } } },
    ]);

    return tagsFromPosts;
  }
}

module.exports = new postService();
