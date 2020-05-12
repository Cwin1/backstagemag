import React from 'react';
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../../api';
import { BASE_IMG } from '../../../utils/constant';

/*
用于图片上传的组件  
*/

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    state = {
        previewVisible: false, //是否显示大图预览
        previewImage: '',
        fileList: [],
    };

    componentWillMount() {
        //根据传入的imgs生成fileList并更新
        const imgs = this.props.imgs
        if (imgs && imgs.length > 0) {
            const fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG + img
            }))
            this.setState({ fileList })
        }
    }

    //获取所有已上传图片文件名的数组
    getImgs = () => this.state.fileList.map(file => file.name)

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        console.log(file)
        //显示指定file对应的大图
        if (!file.url && !file.preview) { //如果file没有图片url，值进行一次base64处理来显示图片
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = async ({ file, fileList }) => {
        console.log(file.status, fileList.length, file)
        //一旦上传成功，将当前上传的file的信息修正(name,url)                
        if (file.status === 'done') {
            //将数组最后一个file保存到file变量
            file = fileList[fileList.length - 1]
            const result = file.response
            //取出相应数据中的图片文件名和url
            const { name, url } = file.response.data
            if (result.status === 0) {
                //保存到上传的file对象
                file.name = name
                file.url = url
                message.success('上传图片成功!')
            } else {
                message.error('上传图片失败!')
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }


        //在操作（上传/删除）过程中更新fileList状态
        this.setState({ fileList });
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"  //上传图片的接口地址
                    accept="image/*" //只接收图片格式
                    name='image' //请求参数名
                    listType="picture-card"  //卡片样式
                    fileList={fileList}  //已上传图片文件的列表
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall;