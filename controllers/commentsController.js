const postModel = require('../models/postModel');
const commentsService = require('../service/commentsService');

class commentsController {
  async addComment(req, res) {
    try {
      const postId = req.params.id;

      const comment = {
        CommentText: req.body.CommentText,
        user: req.body.user,
      };

      const addCom = await commentsService.addComment(postId, comment);

      return res.json(addCom);
    } catch (err) {
      console.log(err);
    }
  }

  async getFirstComments(req, res) {
    try {
      const comments = await commentsService.getFirstComments();

      return res.json(comments);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteComment(req, res) {
    try {
      console.log(req.body);
      const commentId = req.body.commentId;

      const comment = await commentsService.deleteComment(commentId);

      return res.json(comment);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new commentsController();
