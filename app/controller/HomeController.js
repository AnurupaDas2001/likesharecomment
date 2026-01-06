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

            await Like.create({
                postId,
                userId: req.user.id
            });

            res.status(200).json({
                success: true,
                message: "Post liked"
            });

        } catch (err) {
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

            await Share.create({
                postId,
                userId: req.user.id
            });

            res.status(200).json({
                success: true,
                message: "Post shared"
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }

    async post(req, res) {
        try {
          const { title, description } = req.body;
    
          if (!title) {
            return res.status(400).json({
              success: false,
              message: "Title is required"
            });
          }
    
          const post = await Post.create({
            title,
            description,
            userId: req.user.id
          });
    
          res.status(201).json({
            success: true,
            message: "Post created",
            post
          });
    
        } catch (err) {
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        }
      }
    
      async postall(req, res) {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json({ success: true, posts });
      }

      async getPostCounts(req, res) {
        try {
          const posts = await Post.find().sort({ createdAt: -1 });
      
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
      
          res.status(200).json({
            success: true,
            data: result
          });
      
        } catch (error) {
          console.error(error);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        }
      }
      
}

module.exports = new HomeController();
