import React from 'react';
import PropTypes from 'prop-types';
import menuList from '../../../config/menuConfig';
import {
    Form,
    Input,
    Tree
} from 'antd';

//添加角色的form组件

const Item = Form.Item
const { TreeNode } = Tree;

class UpdateForm extends React.PureComponent {

    static propTypes = {
        role: PropTypes.object
    };

    constructor(props) {
        super(props);
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    };

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.path} >
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
    };

    //为父组件获取最新的menus数据的方法
    getMenus = () => this.state.checkedKeys

    //选中某个node时的回调
    onCheck = checkedKeys => {
        // console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    };

    /*
    根据新传入的role来更新checkedKey状态
    当组件接受到新的属性是自动调用的生命周期函数
    */
    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        // console.log('nextProps', menus);
        this.setState({
            checkedKeys: menus
        })
    };

    render() {
        const { role } = this.props
        const { checkedKeys } = this.state

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        }

        return (
            <div>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>

                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        );
    }
}


export default UpdateForm;
