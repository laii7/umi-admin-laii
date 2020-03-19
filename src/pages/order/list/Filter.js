import React from "react";
import PropTypes from "prop-types";
import { Form, Button, Row, DatePicker, Select } from "antd";
import moment from "moment";

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Filter = ({
  onFilterChange,
  filter,
  form: { getFieldDecorator, getFieldsValue, setFieldsValue }
}) => {

  const handleSubmit = (page = null) => {
    let fields = getFieldsValue();
    if(!fields.time || fields.time.length === 0){
      setFieldsValue({
        time: [moment(new Date()).subtract(1,'months'), moment(new Date())],
      });
      fields = getFieldsValue();
    }
    fields.start_at = fields.time[0].format(dateFormat);
    fields.end_at = fields.time[1].format(dateFormat);
    if (page) {fields.page = page;}
    delete fields.time;
    onFilterChange(fields);
  };
  // useEffect(() => {
  //   handleSubmit()
  // }, []);

  const reset = () => {
    setFieldsValue({
      time: [moment(new Date()).subtract(1,'months'), moment(new Date())],
      date_type: '1',
    });
    handleSubmit(1)
  };


  return (
    <div>
      <Form layout="inline" style={{ marginBottom: 10 }}>

        <Row>
          <FormItem label="" colon={false}>
            {getFieldDecorator("date_type", {
              initialValue: filter.date_type || '1'
            })(
              <Select style={{ width: 130 }}>
                {/* <Option value="">全部</Option> */}
                <Option value="1">投保时间</Option>
                <Option value="2">生效时间</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="时间:">
            {getFieldDecorator("time", {
              initialValue: (filter && filter.start_at && filter.end_at) ? [moment(filter.start_at, dateFormat), moment(filter.end_at, dateFormat)] : [moment(new Date()).subtract(1,'months'), moment(new Date())]
              // initialValue:filter.begin_at?[moment(filter.end_at, dateFormat), moment(filter.end_at, dateFormat)] :[moment(getTime(true), dateFormat), moment(getTime(), dateFormat)]
            })(<RangePicker format={dateFormat}
              ranges={{
                '今天': [moment(), moment()],
                '昨天': [moment(new Date()).add(-1, 'days'), moment(new Date()).add(-1, 'days')],
                '过去3天': [moment().day(-1), moment(new Date()).add(-1, 'days')],
                '过去5天': [moment().day(-3), moment(new Date()).add(-1, 'days')],
                '过去一周': [moment().day(-5), moment(new Date()).add(-1, 'days')],
                '过去一个月': [moment(new Date()).subtract(1,'months'), moment(new Date()).add(-1, 'days')],
              }}
            />)}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              className="margin-right"
              onClick={handleSubmit.bind(null,null)}
            >
              搜索
            </Button>
            <Button className="margin-right" onClick={reset}>
              重置
            </Button>
          </FormItem>
        </Row>
      </Form>
    </div>
  );
};

Filter.propTypes = {
  addManager: PropTypes.func
};

export default Form.create()(Filter);
