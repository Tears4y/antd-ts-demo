import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Popconfirm, Typography, Input, Space, Table, Card, Button, Dropdown, Avatar, Tag, Upload, TableColumnsType } from 'antd';
import { EditTwoTone, DeleteTwoTone, EditOutlined, DeleteOutlined, UserOutlined, SmileOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios';
import { BaseImgUrl, BaseUrl } from '../environment';
import AddProductType from './AddProductType';
const { Text } = Typography;

interface Item {
  id: React.Key;
  category_id: React.Key;
  title: string;
  discription: string;
  price: number;
  product_image: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};



const ProductTypeDisplay: React.FC = () => {

  const iconStyle = { fontSize: "1.4rem" }

  const [form] = Form.useForm();
  const [products, setProducts] = useState<Item[]>([])
  const [disable, setDisable] = useState(true)
  const [image, setImage] = useState(null)
  const [editingId, setEditingId] = useState<React.Key>("")

  const isEditing = (record: Item) => record.id === editingId;

  useEffect(() => {
    axios.get(`${BaseUrl}products`)
      .then(res => {
        console.log(res.data)
        setProducts(res.data)
      })
      .catch(err => console.log(err))
  }, [])


  /* 删除数据相关 */
  const handleDelProductType = (record: Item) => {
    const userToken = localStorage.getItem('react-demo-token')
    const config = {
      headers: {
        token: userToken
      }
    }

    axios.delete(`${BaseUrl}product/${record.id}`, config)
      .then(() => {
        const newData = [...products]
        const index = newData.findIndex((product: Item) => record.id === product.id);
        newData.splice(index, 1)
        setProducts(newData)
        console.log("delete success")
      })
      .catch((err) => console.log(err))
  }


  /* 修改数据相关 */
  const handleEditProductType = (record: Item) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
  };

  const editSubmit = async (record: Item) => {
    const row = await form.validateFields();
    const formData = new FormData()

    row.title && formData.append('title', row.title)
    row.description && formData.append('description', row.description)
    row.price && formData.append('price', row.price)
    image && formData.append('product_image', image)
    formData.append('_method', 'put')

    axios.post(`${BaseUrl}product/${record.id}`, formData)
      .then(res => {
        const newData: any = [...products];
        const index = newData.findIndex((product: Item) => record.id === product.id);
        newData.splice(index, 1, res.data);
        setProducts(newData)
        setEditingId('')
        setDisable(true)
        console.log("edit success")
      })
      .catch(err => console.log(err))
  };

  const editCancel = () => {
    setEditingId('')
    setDisable(true)
  }


  const handleAddOrderType = () => {
    console.log("handleAddOrderType")
  }

  const handleDelOrderType = () => {
    console.log("handleDelOrderType")
  }

  const handleEditOrderType = () => {
    console.log("handleEditOrderType")
  }


  /* 用户 Menu 的处理 */
  const handleLogOut = () => {
    localStorage.removeItem('react-demo-token')
    localStorage.removeItem('react-demo-user')
    window.location.reload()
  }

  let user
  const auth = localStorage.getItem("react-demo-token")
  if (auth) {
    user = JSON.parse(localStorage.getItem("react-demo-user") as string)
  }

  const items = [
    {
      key: '1',
      label: (
        <Text>
          {user.email}
        </Text>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: '4',
      danger: true,
      label: 'Log Out',
      onClick: handleLogOut
    },
  ];

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      editable: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: true,
    },
    {
      title: 'Photo',
      dataIndex: 'product_image',
      render: (_: Item, record: Item) => <img src={`${BaseImgUrl}${record.product_image}`} width="100" height="80" />,
      editable: false,
    },
    {
      title: 'Action',
      render: (_: Item, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type='text' onClick={() => editSubmit(record)}>
              <CheckOutlined style={iconStyle} />
            </Button>

            <Button type='text' onClick={editCancel}>
              <CloseOutlined style={iconStyle} />
            </Button>

          </Space>
        ) : (
          <Space >
            <Button type="text" disabled={editingId !== ''} onClick={() => handleEditProductType(record)}>
              <EditOutlined style={iconStyle} />
            </Button>
            <Popconfirm title="Are you sure to delete this product?" description={<br />} okText="Yes" cancelText="No" onConfirm={() => handleDelProductType(record)}>
              <Button type="text" disabled={editingId !== ''} >
                <DeleteOutlined style={iconStyle} />
              </Button>
            </Popconfirm>
            <Button type="dashed" disabled={editingId !== ''} onClick={handleAddOrderType}>
              Add Order
            </Button>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'price' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


  /* 扩展表格相关的内容 */
  const expandedRowRender = () => {
    const data = [];
    // for (let i = 0; i < 3; ++i) {
    data.push({
      key: 0,
      order_type: 'R2P',
      sequence: 'Printing  Production  Packaging',
    });
    data.push({
      key: 1,
      order_type: 'R2S',
      sequence: 'Printing  Production ',
    });
    data.push({
      key: 2,
      order_type: 'S2P',
      sequence: ' Production  Packaging',
    });
    // }

    const columns = [
      { title: 'Order Type', dataIndex: 'order_type' },
      {
        title: 'Sequence', render: (_: any, render: any) => <Tag color="geekblue">{render.sequence}</Tag>
      },
      {
        title: 'Action',
        render: () => (
          <Space >
            <Button type="text" onClick={handleEditOrderType} >
              <EditTwoTone style={iconStyle} />
            </Button>
            <Button type="text" onClick={handleDelOrderType}>
              <DeleteTwoTone style={iconStyle} />
            </Button>
          </Space>
        ),
      },
    ];

    return <Table columns={columns} dataSource={data} pagination={false} />;
  };



  return (
    <Card>
      <Dropdown menu={{ items }}>
        <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: 'skyblue', marginBottom: '1rem' }} />
      </Dropdown>
      <h1>Product Type Management</h1>

      <Form form={form} component={false}>
        <AddProductType
          products={products}
          setProducts={setProducts}
        />
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowKey='id'
          dataSource={products}
          columns={mergedColumns}
          expandable={{ expandedRowRender }}
          pagination={{ onChange: editCancel, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10, 20, 50], total: products.length, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items` }}
        />
      </Form>
    </Card>
  );
};

export default ProductTypeDisplay;