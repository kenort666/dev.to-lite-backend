const { validationResult } = require('express-validator');
const postModel = require('../models/postModel');
const postService = require('../service/postService');
const ApiError = require('../exceptions/apiError');

class postController {
  async getPosts(req, res, next) {
    try {
      const posts = await postService.getAllPosts();
      res.json(posts);
    } catch (err) {
      res.status(500).json({
        message: 'Не удалось получить все статьи',
      });
    }
  }

  async createNewPost(req, res, next) {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации', errors.array())
        );
      }
      const post = await postService.createPost(req);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  async getOne(req, res) {
    try {
      const postId = req.params.id;
      const findAndUpdate = await postService.getOnePost(postId);

      res.json(findAndUpdate);
    } catch (err) {
      res.status(500).json({
        message: 'Не удалось получить одну статью',
      });
    }
  }

  async deleteOne(req, res) {
    try {
      const postId = req.params.id;
      const findAndDelete = await postService.deletePost(postId);

      res.json(findAndDelete);
    } catch (err) {
      res.status(500).json({
        message: 'Не удалось удалить статью',
      });
    }
  }

  async updateOne(req, res) {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации', errors.array())
        );
      }

      const postId = req.params.id;
      const post = req.body;

      const update = await postService.updatePost(postId, post);
      res.json(update);
    } catch (err) {
      res.status(500).json({
        message: 'Не удалось обновить статью',
      });
    }
  }

  async getTags(req, res) {
    try {
      const tags = await postService.getTags();

      res.json(tags);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить тэги с статьи',
      });
    }
  }

  async getPostsByTags(req, res) {
    try {
      const tagName = req.params.name;

      const findPosts = await postService.findPostByTag(tagName);

      res.json(findPosts);
    } catch (err) {
      res.status(500).json({
        message: 'Не удалось найти посты по тэгам',
      });
    }
  }
}

module.exports = new postController();
