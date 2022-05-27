import React from 'react';
import './share.css';
import { PermMedia, Label, Room, EmojiEmotions, Close } from '@material-ui/icons';
import { TextField, ImageList, ImageListItem, Container, Select, MenuItem, FormControl } from '@material-ui/core';
import config from '../../../config';
import User1 from './../../../assets/images/users/user.svg';
import { SocketContext } from '../../../utils/socket/SocketContext';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Share = ({ user, setPosts }) => {
    const hiddenFileInput = React.useRef(null);
    const account = useSelector((s) => s.account);
    const { emitNewPost } = React.useContext(SocketContext);
    const [content, setContent] = React.useState('');
    const [announcement, setAnnouncement] = React.useState(false);
    const [postPrivacy, setPostPrivacy] = React.useState(true);
    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };
    const [selectedFile, setSelectedFile] = React.useState({});

    const onChangeFileUpload = (e) => {
        setSelectedFile(e.target.files[0]);
    };
    const removeItem = (val) => {
        setSelectedFile({});
    };
    const handleChange = (e) => {
        setContent(e.target.value);
    };
    const submitPost = async () => {
        const formData = new FormData();
        if (content === '' && selectedFile === null) return;

        const post = {
            userId: account.user._id,
            visibility: postPrivacy,
            priority: announcement
        };
        if (content !== '') {
            post.content = content;
        }

        formData.append('file', selectedFile);

        console.log(post);
        try {
            if (selectedFile !== null) {
                try {
                    const up = await axios.post(config.API_SERVER + 'upload', formData);
                    post.attachment = [up.data.upload];
                } catch (error) {
                    console.log(error);
                }
            }

            const res = await axios.post(config.API_SERVER + 'posts', post);
            setPosts((prev) => [...prev, res.data]);
            emitNewPost(account.user._id, post.priority);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="share" style={{ backgroundColor: 'white' }}>
            <div className="shareWrapper">
                <div className="selectHolder">
                    <div className="sharePrivacy">
                        <Select
                            size="small"
                            label="Privacy"
                            name="privacy"
                            id="privacy"
                            type="text"
                            value={postPrivacy}
                            onChange={(e) => setPostPrivacy(e.target.value)}
                            className="shareSelect"
                        >
                            <MenuItem value={true}>Public</MenuItem>
                            <MenuItem value={false}>Private</MenuItem>
                        </Select>
                    </div>
                    {user.role !== 'USER' && (
                        <div className="sharePrivacy">
                            <Select
                                size="small"
                                label="Type"
                                name="type"
                                id="Type"
                                type="text"
                                value={announcement}
                                onChange={(e) => setAnnouncement(e.target.value)}
                                className="shareSelect"
                            >
                                <MenuItem value={false}>Normal Post</MenuItem>
                                <MenuItem value={true}>Announcement</MenuItem>
                            </Select>
                        </div>
                    )}
                </div>
                <div className="shareTop">
                    <img className="shareProfileImg" src={user.profilePicture ? config.CONTENT + user.profilePicture : User1} alt="" />
                    <input
                        placeholder={`What's in your mind ${user.first_name}?`}
                        value={content}
                        onChange={handleChange}
                        className="shareInput"
                    />
                </div>
                {/* 
                <div className="shareMiddle">
                    <ImageList sx={{ width: '100%' }} rowHeight={164} cols={3}>
                        {selectedFiles?.map((item, i) => {
                            return (
                                <ImageListItem key={i}>
                                    {(item.name.includes('.png') || item.name.includes('.jpg')) && (
                                        <div className="uploadedImageContainer">
                                            <Close className="close" onClick={() => removeItem(item.name)} />
                                            <img className="uploadedImage" src={`${URL.createObjectURL(item)}`} />
                                        </div>
                                    )}
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                </div> */}
                <hr className="shareHr" />
                <div className="shareBottom">
                    <div className="shareOptions">
                        <div className="shareOption" onClick={handleClick}>
                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText">Photo or Video</span>
                            <input type="file" ref={hiddenFileInput} onChange={onChangeFileUpload} style={{ display: 'none' }} />
                        </div>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon" />
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon" />
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" onClick={submitPost}>
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Share;
