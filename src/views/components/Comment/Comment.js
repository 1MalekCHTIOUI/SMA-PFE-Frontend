import { Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import config from '../../../config';
import './comment.css';
import { Link } from 'react-router-dom';
import likeImage from '../../../assets/images/icons/like.png';
import { PictureAsPdf } from '@material-ui/icons';
const Comment = ({ comment }) => {
    const [user, setUser] = useState({});
    const account = useSelector((s) => s.account);
    useEffect(() => {
        const getUser = async () => {
            try {
                const fetchUser = await axios.get(config.API_SERVER + 'user/users/' + comment.uploadedBy.userId);
                setUser(fetchUser.data);
            } catch (error) {
                console.log(error.message);
            }
        };
        getUser();
    }, []);

    const [like, setLike] = useState(comment.likes.length);
    const [isLiked, setIsLiked] = useState(comment.likes.some((u) => u.userId === account?.user._id));

    const likeHandler = () => {
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    };
    const isImage = (str) => {
        return str.includes('.png') || str.includes('.jpg');
    };
    const isDocument = (str) => {
        return str.includes('.pdf') || str.includes('.docx');
    };
    return (
        <div className="comment">
            <div className="commentWrapper">
                <img style={{ width: '2rem', height: '2rem', borderRadius: '50%' }} src={config.CONTENT + user.profilePicture} alt="" />
                <div className="commentContentWrapper">
                    <div className="commentField">
                        <Typography className="commentUploader" variant="text">
                            {user.first_name} {user.last_name}
                        </Typography>
                        <Typography>{comment?.content}</Typography>
                        {comment.attachment?.map((a) => {
                            if (isImage(a.actualName)) {
                                return (
                                    <a component={Link} href={config.CONTENT + a.actualName} target="_blank">
                                        <img
                                            style={{ padding: '10px', width: '10rem', height: '10rem', borderRadius: '10px' }}
                                            src={config.CONTENT + a.actualName}
                                            alt="loading"
                                        />
                                    </a>
                                );
                            }
                        })}
                        {comment.attachment?.map((a) => {
                            if (isDocument(a.actualName)) {
                                return (
                                    <a component={Link} href={config.CONTENT + a.actualName} target="_blank">
                                        <PictureAsPdf /> {a.displayName}
                                    </a>
                                );
                            }
                        })}
                    </div>
                    <div className="commentBottom">
                        <img className="likeIcon" src={likeImage} onClick={likeHandler} alt="" />
                        <span className="commentLikeCounter">{like}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comment;
