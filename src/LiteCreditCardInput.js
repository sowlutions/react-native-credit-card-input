import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
} from "react-native";

import Icons from "./Icons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const INFINITE_WIDTH = 1000;

const s = StyleSheet.create({
  container: {
    // paddingLeft: 10,
    // paddingRight: 10,
    // alignItems: "center",
    // overflow: "hidden",
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: 'contain'
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: "hidden",
  },
  rightPart: {
    flexDirection: "row",
    width: '100%',
  },
  last4: {
    flex: 1,
    justifyContent: "center",
  },
  numberInput: {
    width: INFINITE_WIDTH,
  },
  expiryInput: {
    // paddin
    borderBottomColor: '#939393',
    borderBottomWidth: 1
  },
  cvcInput: {
    // width: 80,
    borderBottomColor: '#939393',
    borderBottomWidth: 1
  },
  last4Input: {
    width: 60,
    marginLeft: 20,
  },
  input: {
    height: 40,
    color: "black",
  },
  paddingView: {
    marginRight: 35
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,

    inputStyle: Text.propTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    placeholders: {
      number: "",
      expiry: "",
      cvc: "",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    additionalInputsProps: {},
  };

  // componentDidMount = () => this._f  ocus(this.props.focused);

  componentDidUpdate(prevProps) {
    if (prevProps.focused !== this.props.focused) this._focus(this.props.focused);
  }

  _focusNumber = () => this._focus("number");
  _focusExpiry = () => this._focus("expiry");

  _focus = field => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  }

  _inputProps = field => {
    const {
      inputStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _iconToShow = () => {
    const { focused, values: { type } } = this.props;
    if (focused === "cvc" && type === "american-express") return "cvc_amex";
    if (focused === "cvc") return "cvc";
    if (type) return type;
    return null;
  }
  _inputProps = field => {
    const {
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      labels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    const {
      focused,
      values: { number },
      inputStyle,
      status: {
        number: numberStatus
      }
    } = this.props;

    const showRightPart = focused && focused !== "number";

    let iconToShow = Icons[this._iconToShow()]

    return (
      <View style={s.container}>
        <View style={[{
          flexDirection: 'row',
          alignItems: 'flex-end',
          width: 300,
          borderBottomColor: '#939393',
          borderBottomWidth: 1
        }, focused === 'number' && { borderBottomColor: '#1273FF' }]}>
          <View style={[
            s.expanded,
            s.leftPart
          ]}>
            <CCInput
              {...this._inputProps("number")}
              keyboardType="numeric"
              containerStyle={s.numberInput}
            />
          </View>
          {iconToShow !== null && <Image style={s.icon} source={iconToShow} />}
        </View>
        <View style={[
          s.rightPart
        ]}>
          <CCInput
            {...this._inputProps("expiry")}
            keyboardType="numeric"
            containerStyle={
              [s.expiryInput, focused === 'expiry' && { borderBottomColor: '#1273FF' }]}
          />
          <View style={s.paddingView} />
          <CCInput
            {...this._inputProps("cvc")}
            keyboardType="numeric"
            containerStyle={[
              s.cvcInput,
              focused === 'cvc' && { borderBottomColor: '#1273FF' }
            ]}
          />
        </View>
      </View >
    );
  }
}
