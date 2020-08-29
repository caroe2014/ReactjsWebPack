import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Text, Input } from 'rebass';
import i18n from 'web/client/i18n';

const InstructionLabel = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 700;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 5px;
  background-color: #f0f0f3;
  padding: 10px 15px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InstructionText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: ${props => props.theme.fontSize.nm};
  margin-bottom: 5px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InstructionCount = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: ${props => props.theme.fontSize.nm};
  margin-bottom: 5px;
  margin-top: 5px;
  text-align: right;
`;

const CustomTipInput = styled(Input)`
  padding: 5px;
  height: 35px;
  &::placeholder {
    color: #BCBCBC;
    opacity: 1;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
  width: 100%;
  color: ${props => props.theme.colors.primaryTextColor};
  box-shadow: none;
  border: 1px solid #ddd;
  border-radius: 0px
  -moz-appearance: textfield;
`;

const InstructionInput = styled.div`
  padding: 10px 15px;
`;

class SpecialInstructionInput extends Component {

  constructor (props) {
    super(props);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.state = {
      splInstructionInput: ''
    };
  }

  static defaultProps = {
    characterLimit: 20
  }

  handleUserInput (e) {
    const value = e.target.value;
    const { characterLimit } = this.props;
    if (value) {
      if (value.length <= characterLimit) {
        this.setState({ splInstructionInput: value });
        this.props.handleSplInstruction(value);
      }

    } else {
      this.setState({ splInstructionInput: '' });
      this.splInstruction.value = '';
      this.props.handleSplInstruction('');
    }
  }

  render () {
    const { headerText, instructionText, characterLimit } = this.props;
    const { splInstructionInput } = this.state;

    return (
      <React.Fragment>
        <InstructionLabel
          tabIndex={0}
          aria-label={headerText || i18n.t('SPECIAL_INSTRUCTION_HEADER')}>
          {headerText || i18n.t('SPECIAL_INSTRUCTION_HEADER')}
        </InstructionLabel>
        <InstructionInput>
          <InstructionText
            tabIndex={0}
            aria-label={instructionText || i18n.t('SPECIAL_INSTRUCTION_TEXT')}>
            {instructionText || i18n.t('SPECIAL_INSTRUCTION_TEXT')}
          </InstructionText>
          <CustomTipInput
            innerRef={(e) => { this.splInstruction = e; }}
            className='custom-tip-input-field'
            type='text'
            onChange={(e) => this.handleUserInput(e)}
            value={splInstructionInput}
            tabIndex={0}
            aria-label={i18n.t('ENTER_INSTRUCTION')}
          />
          <InstructionCount>{splInstructionInput ? splInstructionInput.length : 0}/{characterLimit}</InstructionCount>
        </InstructionInput>
      </React.Fragment>
    );
  }

}

SpecialInstructionInput.propTypes = {
  headerText: PropTypes.string.isRequired,
  instructionText: PropTypes.string.isRequired,
  characterLimit: PropTypes.number
};

export default SpecialInstructionInput;
