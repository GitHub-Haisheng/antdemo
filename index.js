import React from 'react';
import ReactDOM from 'react-dom';
import { DatePicker, message, Radio  } from 'antd';
import { Form, Input, Button, InputNumber, Tooltip, Icon} from 'antd'
import { Row, Col} from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const RangePicker = DatePicker.RangePicker

let QCARD_COLOR = {
    GREEN: 1,
    YELLOW: 2,
    BLUE: 3,
    RED: 5 
};

const CUSTOM_URLS = [
    "https://qpay-act.tenpay.com/qpay_qrcode/openPayCode.html",     //付款码
    "https://qpay-act.tenpay.com/qpay_qrcode/openScan.html",        //扫一扫
]

let OPEN_QPAY_CODE_URL = 'https://qpay-act.tenpay.com/qpay_qrcode/openPayCode.html';
let OPEN_QSCAN_URL = 'https://qpay-act.tenpay.com/qpay_qrcode/openScan.html';

const QCardEditForm = Form.create()(React.createClass({
    getInitialState() {
        var editting = {};
        var committing = {
            base_info: {
                logo_url: '',   //券的logo
                code_type: 'CODE_TYPE_TEXT', //券的code展示类型
                brand_name: '', //券的商标名
                title: '',  //券的名称
                color: QCARD_COLOR.RED, //券显示的颜色，默认为红色（5）
                notice: '',    //券的一行提示语
                description: '',    //券使用说明
                sku: {
                    quantity: 0,        //券总数
                },
                date_info: {
                    type: 'DATE_TYPE_MIX_RANGE_TERM_2',
                    fixed_term: 7,
                    fixed_begin_term: 0,
                    begin_timestamp: 1477929600,
                    end_timestamp: 1498838400
                },
                get_limit: 10,      // 每人限领取次数
                custom_url_name: '立即使用',
                custom_url: '',
                use_custom_code: true
            }
        };
        return {
            editting: editting,
            committing: committing
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        
        var values = this.props.form.getFieldsValue();

        var range = values.date_info.begin_end_time;
        var dateInfo = {
            fixed_begin_term: values.date_info.fixed_begin_term,
            fixed_term: values.date_info.fixed_term,
            begin_timestamp: range[0].unix(),
            end_timestamp: range[1].unix()
        };
        values.date_info = dateInfo;

        values.custom_url = this.state.editting.custom_url;
        
        Object.assign(this.state.committing.base_info, values);


        console.log(this.state.committing);

    },

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6  },
            wrapperCol: { span: 14  },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 6,
            },
        };

        return (
            <Form horizontal onSubmit = {this.handleSubmit}>
                <FormItem {...formItemLayout} label='卡券名称'>
                { getFieldDecorator('title', {
                    rules: [
                        {
                            required: true, message: '卡券名称必须填写'
                        }
                    ]
                })(
                    <Input type='text'/>
                ) }
                </FormItem>

                <FormItem { ...formItemLayout } label='卡券Logo'>
                {
                    getFieldDecorator('logo_url', {
                        rules: [
                            { required: true, message: '卡券logo url必须填写' }
                        ]
                    })(
                        <Input type='url'/>
                    )
                }
                </FormItem>

                <FormItem {...formItemLayout } label='商家名称'>
                { getFieldDecorator('brand_name', {
                    rules: [
                        {required: true, message: '卡券商家名称必须填写'}
                    ]
                }) (
                    <Input type='text'/>
                )}
                    
                </FormItem>

                <FormItem {...formItemLayout } label='使用提醒'>
                { getFieldDecorator('notice', {
                    rules: [
                        {required: true, message: '使用提醒必须填写'}
                    ]
                }) (
                    <Input type='text'/>
                )}
                    
                </FormItem>

                <FormItem { ...formItemLayout } label='规则说明'>
                { getFieldDecorator('description', {
                    rules: [
                        {required: true, message: '规则说明必须填写'}
                    ]
                }) (
                    <Input type='textarea' rows={10}/>
                )}
                </FormItem>

                <FormItem {...formItemLayout} label='卡券颜色'>
                { getFieldDecorator('color', {
                    rules: [
                        {required: true}
                    ],
                    initialValue: QCARD_COLOR.RED
                }) (
                    <RadioGroup>
                        <Radio value={QCARD_COLOR.GREEN}>绿色</Radio>
                        <Radio value={QCARD_COLOR.YELLOW}>黄色</Radio>
                        <Radio value={QCARD_COLOR.BLUE}>蓝色</Radio>
                        <Radio value={QCARD_COLOR.RED}>红色</Radio>
                    </RadioGroup>
                )}
                </FormItem>

                <FormItem { ...formItemLayout } label='卡券数量'>
                { getFieldDecorator('sku.quantity', {
                    rules: [
                        {type: 'number', required: true, message: '卡券数量必须填写'}
                    ]
                }) (
                    <InputNumber min={0}/>
                )}
                </FormItem>
                
                <FormItem { ...formItemLayout } label={(
                    <span>
                        券有效时间&nbsp;
                        <Tooltip title="该批次券的最小和最大有效时间">
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>
                )}>
                {getFieldDecorator('date_info.begin_end_time', {

                })(
                    <RangePicker placeholder={['Begin Time', 'End Time']} 
                                 showTime format="YYYY-MM-DD HH:mm:ss"
                                 style={{display: 'block'}}/>
                )}
                </FormItem>
                <Row> 
                    <Col span={2} offset={6} style={{lineHeight:'30px'}}>领取后</Col>
                    <Col span={4}>
                    <FormItem>
                    {getFieldDecorator('date_info.fixed_begin_term', {
                        initialValue: 0
                    })(
                        <InputNumber min={0} />
                    )}
                    </FormItem>
                    </Col>
                    <Col span={4} style={{lineHeight:'30px'}}>天生效，有效期</Col>
                    <Col span={4}>
                    <FormItem>
                    {getFieldDecorator('date_info.fixed_term', {
                        initialValue: 7
                    })(
                        <InputNumber min={0} />
                    )}
                    </FormItem>
                    </Col>
                    <Col span={1} style={{lineHeight:'30px'}}>天</Col>
                </Row>

                <FormItem { ...formItemLayout } label='每人限领次数'>
                { getFieldDecorator('get_limit', {
                    rules: [
                        {type: 'number', required: true, message: '每人限领数量必须填写'}
                    ]
                }) (
                    <InputNumber min={0}/>
                )}
                </FormItem>

                <FormItem {...formItemLayout} label='『立即使用』链接'>
                { getFieldDecorator('custom_url', {
                    rules: [
                        {required: true, type: 'number', message: '点击『立即使用』时跳转的链接必须填写'}
                    ],
                    initialValue: 0
                }) (
                    <RadioGroup onChange={(e)=>{ this.state.editting.custom_url_idx = e.target.value;
                        if (e.target.value < 2)this.state.editting.custom_url=CUSTOM_URLS[e.target.value] }}>
                        <Radio value={0}>付款码页面</Radio>
                        <Radio value={1}>扫一扫页面</Radio>
                        <Radio style={{display:'block', height:'30px', lineHeight: '30px'}} value={2}>
                            其他..
                            {this.state.editting.custom_url_idx === 2 ? 
                                <Input type='url' style={{marginLeft:10, width:300}} onChange={(e)=>{this.state.editting.custom_url=e.target.value}}/> : null }
                        </Radio>
                    </RadioGroup>
                            
                )}
                </FormItem>

                <FormItem { ...tailFormItemLayout }>
                    <Button type="primary" htmlType="submit">提交申请</Button>
                </FormItem>
            </Form>
        )
    }
}));


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',

        };

    }
    handleChange(date) {
        message.info('您选择的日期是: ' + date.toString());
        this.setState({ date  });

    }

    render() {
        return (
            <div style={{ width: 600, margin: '100px auto'  }}>
                <QCardEditForm/>
            </div>
        );

    }

}

ReactDOM.render(<App />, document.getElementById('root'));
