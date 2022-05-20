import './post.css';
import { MoreVert, PermMedia } from '@material-ui/icons';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../../../config';
import { format } from 'timeago.js';
import likeImage from '../../../assets/images/icons/like.png';
import { useSelector } from 'react-redux';
import { Collapse, TextField, Typography } from '@material-ui/core';
import Comment from '../Comment/Comment';
export default function Post({ post }) {
    const account = useSelector((s) => s.account);
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(post.likes.some((u) => u.userId === account?.user._id));

    const [user, setUser] = useState({});
    const [numberOfitemsShown, setNumberOfitemsShown] = useState(3);

    const [comments, setComments] = useState(null);
    const [comment, setComment] = useState('');
    const [show, setShow] = useState(false);
    const hiddenFileInput = useRef(null);
    const [content, setContent] = useState('');

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };
    const [selectedFiles, setSelectedFiles] = useState([]);

    const onChangeFileUpload = (e) => {
        setSelectedFiles((prev) => [...prev, e.target.files[0]]);
    };
    const removeItem = (val) => {
        setSelectedFiles((prev) => prev.filter((item) => item.name !== val));
    };
    const handleChange = (e) => {
        setContent(e.target.value);
    };
    const likeHandler = () => {
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    };

    const likePost = async () => {
        try {
            await axios.put(config.API_SERVER + 'posts/like/' + post._id, {
                userId: account.user._id,
                username: `${user.first_name} ${user.last_name}`
            });
        } catch (error) {
            console.log(error);
        }
    };
    const unlikePost = async () => {
        try {
            await axios.put(config.API_SERVER + 'posts/unlike/' + post._id, {
                userId: account.user._id
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isLiked) {
            likePost();
        } else {
            unlikePost();
        }
    }, [isLiked]);

    const showMore = () => {
        if (numberOfitemsShown + 3 <= comments.length) {
            setNumberOfitemsShown(numberOfitemsShown + 3);
        }
    };
    const showLess = () => {
        setNumberOfitemsShown(numberOfitemsShown - 3);
    };
    const getUser = async () => {
        try {
            const fetchUser = await axios.get(config.API_SERVER + 'user/users/' + post?.userId);
            setUser(fetchUser.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const getPostComments = async () => {
        try {
            console.log(post?._id);
            const fetchComments = await axios.get(config.API_SERVER + 'posts/comment/' + post?._id);
            setComments(fetchComments.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const submitComment = async () => {
        if (comment === '' && selectedFiles.length === 0) return;

        const postedComment = {
            postId: post._id,
            content: comment,
            uploadedBy: {
                userId: account.user._id,
                username: account.user.first_name + ' ' + account.user.last_name
            }
        };
        if (content !== '') {
            postedComment.content = content;
        }
        if (selectedFiles.length > 0) {
            postedComment.selectedFiles = selectedFiles;
        }

        try {
            const res = await axios.post(config.API_SERVER + 'posts/comment', postedComment);
            setComments((prev) => [...prev, res.data]);
            setComment('');
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getUser();
        getPostComments();
    }, []);
    const itemsToShow = comments?.slice(0, numberOfitemsShown).map((comment) => <Comment comment={comment} />);
    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <img
                            className="postProfileImg"
                            src={user._id === post.userId && `/uploads/profilePictures/${user.profilePicture}`}
                            alt=""
                        />
                        <span className="postUsername">{user._id === post.userId && user.first_name + ' ' + user.last_name}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.content}</span>
                    {/* <img className="postImg" src={post?.photo} alt="" /> */}
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="likeIcon" src={likeImage} onClick={likeHandler} alt="" />
                        {/* <img className="likeIcon" src={likeImage} onClick={likeHandler} alt="" /> */}
                        {/* <img className="likeIcon" src="assets/heart.png" onClick={likeHandler} alt="" />  */}
                        <span className="postLikeCounter">
                            {isLiked ? 'You and ' : ''}
                            {`${like} people like it`}
                        </span>
                    </div>
                    <div className="postBottomRight" onClick={() => setShow(!show)}>
                        <span className="postCommentText">{comments?.length} comments</span>
                    </div>
                </div>
            </div>
            <Collapse in={show}>
                <div className="commentsContainer">
                    <div className="writeComment">
                        <input
                            className="commentInput"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            fullWidth
                            placeholder="Write comment"
                        />
                        <div className="commentOption" onClick={handleClick}>
                            <PermMedia htmlColor="tomato" className="commentIcon" />
                            {/* <span className="commentOptionText">Photo or Video</span> */}
                            <input type="file" ref={hiddenFileInput} onChange={onChangeFileUpload} style={{ display: 'none' }} />
                        </div>
                        <button onClick={submitComment} className="commentButton">
                            Post
                        </button>
                    </div>

                    {itemsToShow ? itemsToShow : 'Loading...'}
                </div>
                {comments?.length !== itemsToShow?.length ? (
                    <Typography style={{ cursor: 'pointer', textAlign: 'center' }} onClick={showMore}>
                        Show more
                    </Typography>
                ) : (
                    <Typography style={{ cursor: 'pointer', textAlign: 'center' }} onClick={showLess}>
                        Show less
                    </Typography>
                )}
            </Collapse>
        </div>
    );
}