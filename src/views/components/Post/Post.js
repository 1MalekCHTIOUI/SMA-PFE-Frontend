import './post.css';
import { MoreVert, PermMedia, PictureAsPdf } from '@material-ui/icons';
import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import config from '../../../config';
import { format } from 'timeago.js';
import likeImage from '../../../assets/images/icons/like.png';
import { useSelector } from 'react-redux';
import { Collapse, Grid, TextField, Typography, Button } from '@material-ui/core';
import Comment from '../Comment/Comment';
import User1 from './../../../assets/images/users/user.svg';
import { SocketContext } from '../../../utils/socket/SocketContext';
import { Link } from 'react-router-dom';

const isImage = (str) => {
    return str.includes('.png') || str.includes('.jpg');
};
const isDocument = (str) => {
    return str.includes('.pdf') || str.includes('.docx');
};

export default function Post({ post, posts, setPosts }) {
    const account = useSelector((s) => s.account);
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(post.likes.some((u) => u.userId === account?.user._id));
    const { emitNewLike } = useContext(SocketContext);
    const [user, setUser] = useState({});
    const [numberOfitemsShown, setNumberOfitemsShown] = useState(3);

    const [comments, setComments] = useState(null);
    const [comment, setComment] = useState('');
    const [show, setShow] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const hiddenFileInput = useRef(null);
    const [content, setContent] = useState('');

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const deletePost = async () => {
        try {
            axios.delete(config.API_SERVER + 'posts/' + post._id);
            setPosts(posts.filter((u) => u._id !== post._id));
        } catch (error) {
            console.log(error);
        }
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
        isLiked ? unlikePost() : likePost();
        setIsLiked(!isLiked);
    };

    const likePost = async () => {
        try {
            await axios.put(config.API_SERVER + 'posts/like/' + post._id, {
                userId: account.user._id,
                username: `${user.first_name} ${user.last_name}`
            });
            emitNewLike(account.user._id, post.userId);
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

    // useEffect(() => {
    //     if (isLiked) {
    //         likePost();
    //     } else {
    //         unlikePost();
    //     }
    // }, [isLiked]);

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
        if (post?.attachment.length) {
            console.log(post.attachment);
        }
    }, []);

    const itemsToShow = comments?.slice(0, numberOfitemsShown).map((comment) => <Comment comment={comment} />);
    const [enlargeImage, setEnlargeImage] = useState(false);
    return (
        <div className="post" style={{ backgroundColor: 'white' }}>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <img
                            className="postProfileImg"
                            src={user._id === post.userId && (user.profilePicture ? config.CONTENT + user.profilePicture : User1)}
                        />
                        <div className="postTopLeftRight">
                            <span className="postUsername">{user._id === post.userId && user.first_name + ' ' + user.last_name}</span>
                            <span className="postDate">{format(post.createdAt)}</span>
                        </div>
                    </div>
                    <div className="postTopRight">
                        <Typography variant="subtitle2">{post.visibility ? 'Public' : 'Private'}</Typography>
                        {showOptions && account.user._id === post.userId && (
                            <div>
                                <Button variant="outlined" onClick={deletePost}>
                                    Delete
                                </Button>
                            </div>
                        )}
                        <MoreVert onClick={() => setShowOptions(!showOptions)} />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.content}</span>
                    {post?.attachment.length > 0 && (
                        <Grid container xs={12}>
                            {post?.attachment.map((f) => (
                                <Grid item xs={12} justifyContent="center" alignItems="center">
                                    {isImage(f.actualName) && (
                                        <img
                                            className="postImg"
                                            style={
                                                enlargeImage
                                                    ? { transform: 'scale(1.5)', transition: 'transform 0.25s ease' }
                                                    : { transform: 'scale(1)', transition: 'transform 0.25s ease' }
                                            }
                                            onClick={() => setEnlargeImage(!enlargeImage)}
                                            src={user._id === post.userId && config.CONTENT + f.actualName}
                                            alt="loading..."
                                        />
                                    )}
                                    {f.actualName.includes('.mp4') && (
                                        <video
                                            src={config.VIDEO_CONTENT + f.actualName}
                                            width="600"
                                            height="300"
                                            controls="controls"
                                            autoplay="true"
                                        />
                                    )}

                                    {isDocument(f.actualName) && (
                                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <a component={Link} href={config.CONTENT + f.actualName} target="_blank">
                                                <PictureAsPdf /> <Typography className="wrapText">{f.displayName}</Typography>
                                            </a>
                                        </div>
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* <img className="postImg" src={post?.photo} alt="" /> */}
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="likeIcon" src={likeImage} onClick={likeHandler} alt="" />
                        {/* <img className="likeIcon" src={likeImage} onClick={likeHandler} alt="" /> */}
                        {/* <img className="likeIcon" src="assets/heart.png" onClick={likeHandler} alt="" />  */}
                        <span className="postLikeCounter">
                            {isLiked ? 'You and ' + `${like - 1} people like it` : ''}
                            {!isLiked && `${like} people like it`}
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
                        <div onClick={submitComment} className="commentButton">
                            Post
                        </div>
                    </div>

                    {itemsToShow ? itemsToShow : 'Loading...'}
                </div>
                {comments?.length > 0 && comments?.length !== itemsToShow?.length ? (
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
