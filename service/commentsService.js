const postModel = require('../models/postModel');

class commentsService {
  async addComment(postId, comment) {
    const add = await postModel.findByIdAndUpdate(
      { _id: postId },
      {
        $push: { comments: comment },
      }
    );

    return add;
  }

  async deleteComment(commentId) {
    const del = await postModel.findOneAndUpdate(
      {},
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    return del;
  }

  async getFirstComments() {
    const comments = await postModel.aggregate([
      {
        $project: {
          comment: { $first: '$comments' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'comment.user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          comment: '$comment',
          user: {
            name: '$user.name',
            surname: '$user.surname',
            userId: '$user._id',
            userAvatar: '$user.userAvatar',
          },
        },
      },
    ]);
    return comments;
  }
}

module.exports = new commentsService();
