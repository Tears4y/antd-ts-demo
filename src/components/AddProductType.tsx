import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Space, Upload, Collapse, Card, message, UploadFile } from 'antd';
import axios from 'axios';
import { SetStateAction, useState } from 'react';
import { BaseImgUrl, BaseUrl } from '../environment';
const { TextArea } = Input;
const { Panel } = Collapse;

interface AddProductTypeProps {
  products: any;
  setProducts: any;
}

const AddProductType: React.FC<AddProductTypeProps> = ({ products, setProducts }) => {

  const [form] = Form.useForm()

  const [addedSwitch, setAddedSwitch] = useState(false)
  const [image, setImage] = useState(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleAddRowProductType = () => setAddedSwitch(!addedSwitch)

  const handleAddSubmit = async () => {
    const row = await form.validateFields();
    const userToken = localStorage.getItem('react-demo-token')
    const config = {
      headers: {
        token: userToken
      }
    }

    const formData = new FormData()
    formData.append('category_id', '99')
    row.title && formData.append('title', row.title)
    row.description && formData.append('description', row.description)
    row.price && formData.append('price', row.price)
    image && formData.append('product_image', image)

    axios.post(`${BaseUrl}products`, formData, config)
      .then(res => {
        const newData = [res.data, ...products];
        setProducts(newData)
        setAddedSwitch(!addedSwitch)
        form.resetFields()
        console.log("add success")
      })
      .catch(err => console.log(err))
  }

  const handleAddCancel = () => {
    setAddedSwitch(!addedSwitch)
    form.resetFields()
    setFileList([])
  }

  const handleAddImg = ({ fileList: newFileList }: { fileList: any[] }) => setFileList(newFileList);



  return (
    <>
      <Button type='primary' onClick={handleAddRowProductType}>
        Add New
      </Button>

      <Collapse ghost activeKey={addedSwitch ? ['1'] : undefined}>
        <Panel showArrow={false} key="1" header={undefined}>
          <Card>
            <Form
              form={form}
              labelCol={{ span: 4 }}
              layout="horizontal"
              style={{ maxWidth: 600 }}
            >
              <Form.Item label="Title" name="title" rules={[
                {
                  required: true,
                  message: `Please Input title!`
                }
              ]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[
                {
                  required: true,
                  message: `Please Input description!`
                }
              ]}>
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item label="Price" name="price" rules={[
                {
                  required: true,
                  message: `Please Input price!`
                }
              ]}>
                <InputNumber />
              </Form.Item>
              <Form.Item label="Photo" name="product_image" >
                <Upload
                  action={BaseImgUrl}
                  listType='picture-card'
                  fileList={fileList}
                  onChange={handleAddImg}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>
                      Upload
                    </div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Space>
                  <Button type='primary' onClick={handleAddSubmit}>Submit</Button>
                  <Button type='primary' onClick={handleAddCancel}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Panel>

      </Collapse>
    </>
  );
};

export default AddProductType