const Like = require('../model/Like');
const Comment = require('../model/Comment');
const Share = require('../model/Share');
const Post = require('../model/Post');

class HomeController {

  /* LIKE POST */
  async like(req, res) {
    try {
      const { postId } = req.body;

      const alreadyLiked = await Like.findOne({
        postId,
        userId: req.user.id
      });

      if (alreadyLiked) {
        return res.status(400).json({
          success: false,
          message: "Post already liked"
        });
      }

      await Like.create({ postId, userId: req.user.id });

      res.status(200).json({
        success: true,
        message: "Post liked"
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }

  /* COMMENT POST */
  async comment(req, res) {
    try {
      const { postId, comment } = req.body;

      const newComment = await Comment.create({
        postId,
        userId: req.user.id,
        comment
      });

      res.status(201).json({
        success: true,
        message: "Comment added",
        data: newComment
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }

  /* SHARE POST */
  async share(req, res) {
    try {
      const { postId } = req.body;

      await Share.create({ postId, userId: req.user.id });

      res.status(200).json({
        success: true,
        message: "Post shared"
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }

  /* CREATE POST (prevent duplicates per user) */
  async post(req, res) {
    try {
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, message: "Title is required" });
      }

      // Prevent same title by same user
      const exists = await Post.findOne({ title, userId: req.user.id });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "You already created a post with this title"
        });
      }

      const post = await Post.create({ title, description, userId: req.user.id });

      res.status(201).json({ success: true, message: "Post created", post });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }


 
  

  /* GET POSTS WITH LIKE/COMMENT/SHARE counts */
  async getPostCounts(req, res) {
    try {
      // Optionally, filter by user
      const posts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 });

      const result = await Promise.all(
        posts.map(async (post) => {
          const likesCount = await Like.countDocuments({ postId: post._id });
          const commentsCount = await Comment.countDocuments({ postId: post._id });
          const sharesCount = await Share.countDocuments({ postId: post._id });

          return {
            _id: post._id,
            title: post.title,
            description: post.description,
            userId: post.userId,
            createdAt: post.createdAt,
            likes: likesCount,
            comments: commentsCount,
            shares: sharesCount
          };
        })
      );

      res.status(200).json({ success: true, data: result });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = new HomeController();
