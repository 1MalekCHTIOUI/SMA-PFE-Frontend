import React from 'react';
import './share.css';
import { PermMedia, Label, Room, EmojiEmotions, Close, PictureAsPdf } from '@material-ui/icons';
import {
    TextField,
    ImageList,
    ImageListItem,
    Container,
    Select,
    MenuItem,
    FormControl,
    CircularProgress,
    Typography,
    Button,
    Box
} from '@material-ui/core';
import config from '../../../config';
import User1 from './../../../assets/images/users/user.svg';
import { SocketContext } from '../../../utils/socket/SocketContext';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { green } from '@material-ui/core/colors';

const Share = ({ user, setPosts }) => {
    const hiddenFileInput = React.useRef(null);
    const account = useSelector((s) => s.account);
    const { emitNewPost } = React.useContext(SocketContext);
    const [content, setContent] = React.useState('');
    const [announcement, setAnnouncement] = React.useState(false);
    const [postPrivacy, setPostPrivacy] = React.useState(true);
    const [posting, setPosting] = React.useState(false);

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
        setPosting(true);
        const post = {
            userId: account.user._id,
            visibility: postPrivacy,
            priority: announcement
        };
        if (content !== '') {
            post.content = content;
        }

        formData.append('file', selectedFile);
        console.log(selectedFile);

        try {
            if (selectedFile !== null) {
                try {
                    const up = await axios.post(config.API_SERVER + 'upload', formData);
                    post.attachment = [{ displayName: selectedFile.name, actualName: up.data.upload }];
                } catch (error) {
                    setPosting(false);
                    console.log(error);
                }
            }
            console.log(post);
            const res = await axios.post(config.API_SERVER + 'posts', post);
            setPosts((prev) => [...prev, res.data]);
            setContent('');
            setSelectedFile({});
            emitNewPost(account.user._id, post.priority);
            setPosting(false);
            setSuccess(true);
        } catch (error) {
            setPosting(false);
            setSuccess(false);
            console.log(error);
        }
    };
    const [success, setSuccess] = React.useState(false);
    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700]
            }
        })
    };

    return (
        <div className="share" style={{ backgroundColor: 'white' }}>
            <div className="shareWrapper">
                <div className="selectHolder">
                    {announcement === false && (
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
                    )}

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
                    <div className="shareMiddle">
                        {selectedFile?.name &&
                            /* <ImageList sx={{ width: '100%' }} rowHeight={164} cols={3}>
                            <ImageListItem key={1}> */

                            (selectedFile.name?.includes('.png') || selectedFile.name?.includes('.jpg')) && (
                                <div className="uploadedImageContainer">
                                    <Close className="close" onClick={() => removeItem(selectedFile.name)} />
                                    <img className="uploadedImage" src={`${URL.createObjectURL(selectedFile)}`} />
                                </div>
                            )}
                        {selectedFile?.name && (selectedFile.name?.includes('.pdf') || selectedFile.name?.includes('.docx')) && (
                            <div className="uploadedImageContainer">
                                <Close className="close" onClick={() => removeItem(selectedFile.name)} />
                                <PictureAsPdf /> <Typography className="wrapText">{selectedFile.name}</Typography>
                            </div>
                        )}
                        {/* </ImageListItem>
                        </ImageList> */}
                    </div>
                </div>

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
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Button variant="contained" sx={buttonSx} disabled={posting} onClick={submitPost}>
                            Share
                        </Button>
                        {posting && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: green[500],
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px'
                                }}
                            />
                        )}
                    </Box>
                    {/* <button className="shareButton" onClick={submitPost}>
                        {posting ? <CircularProgress size="small" /> : 'Share'}
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default Share;
