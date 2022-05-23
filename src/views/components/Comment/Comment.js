import { Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import config from '../../../config';
import './comment.css';
import likeImage from '../../../assets/images/icons/like.png';
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
    return (
        <div className="comment">
            <div className="commentWrapper">
                <img
                    style={{ width: '2rem', height: '2rem', borderRadius: '50%' }}
                    src={config.HOST + `public/uploads/${user.profilePicture}`}
                    alt=""
                />
                <div className="commentContentWrapper">
                    <div className="commentField">
                        <Typography className="commentUploader" variant="text">
                            {user.first_name} {user.last_name}
                        </Typography>
                        <Typography>{comment?.content}</Typography>
                        {comment.attachment?.map((a) => {
                            if (a.includes('.jpg')) {
                                return (
                                    <img
                                        style={{ padding: '10px', width: '10rem', height: '10rem', borderRadius: '10px' }}
                                        src={config.HOST + `public/uploads/${a}`}
                                        alt=""
                                    />
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
