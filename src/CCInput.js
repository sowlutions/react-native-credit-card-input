import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes,
} from "react-native";

const s = StyleSheet.create({
  baseInputStyle: {
    color: "black",
  },
});

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(["valid", "invalid", "incomplete"]),

    containerStyle: ViewPropTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
    additionalInputProps: PropTypes.shape(TextInput.propTypes),
  };

  static defaultProps = {
    label: "",
    value: "",
    status: "incomplete",
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => { },
    onBlur: () => { },
    onChange: () => { },
    onBecomeEmpty: () => { },
    onBecomeValid: () => { },
    additionalInputProps: {},
  };

  state = {
    focused: false
  }

  componentDidUpdate(prevProps) {
    const { status, value, onBecomeEmpty, onBecomeValid, field } = prevProps;
    const { status: newStatus, value: newValue } = this.props;

    if (value !== "" && newValue === "") onBecomeEmpty(field);
    if (status !== "valid" && newStatus === "valid") onBecomeValid(field);

  }

  focus = () => this.refs.input.focus();

  _onFocus = () => {
    this.setState({ focused: true })
    this.props.onFocus(this.props.field)
  }

  _onBlur = () => {
    this.setState({ focused: false })
    this.props.onBlur(this.props.field)
  }

  _onChange = value => this.props.onChange(this.props.field, value);

  render() {
    const { focused } = this.state
    const { label, value, placeholder, status, keyboardType,
      containerStyle, inputStyle, labelStyle,
      validColor, invalidColor, placeholderColor,
      additionalInputProps } = this.props;
    return (
      <TouchableOpacity onPress={this.focus}
        activeOpacity={0.99}>
        <View style={[containerStyle]}>
          <Text style={[labelStyle, focused && { color: '#1273FF' }]}>
            {!!label && (value !== '' || focused) ? label : ''}
          </Text>
          <TextInput ref="input"
            {...additionalInputProps}
            keyboardType={keyboardType}
            autoCapitalise="words"
            autoCorrect={false}
            style={[
              s.baseInputStyle,
              inputStyle,
              ((validColor && status === "valid") ? { color: validColor } :
                (invalidColor && status === "invalid") ? { color: invalidColor } :
                  {}),
            ]}
            underlineColorAndroid={"transparent"}
            placeholderTextColor={placeholderColor}
            placeholder={placeholder}
            value={value}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            onChangeText={this._onChange} />
        </View>
      </TouchableOpacity>
    );
  }
}
