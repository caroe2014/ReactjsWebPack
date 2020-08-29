import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex, Text } from 'rebass';
import RadioButton from 'web/client/app/components/RadioButton';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import { Trans } from 'react-i18next';

const GATenderTypesContainer = styled(Flex)`
  flex-direction: column;
  .input-field-wrapper .input-text {
    border-bottom: 1px solid #7d7d7d;
  }
  .input-field-wrapper {
    margin-bottom: 0px;
  }
`;

const ModalText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 1em;
  text-align: center;
  padding: 0px 10px;
  width: 80%;
  margin: 20px auto 20px auto;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const RadioButtonContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  color: ${props => props.disabled ? 'grey' : 'black'};
  margin-bottom: 10px;
`;

export default class GAPaymentOptions extends Component {
  constructor (props) {
    super(props);

    this.onGAPaymentOptionSelected = this.onGAPaymentOptionSelected.bind(this);
    this.checkIfTenderTypeIsIneligible = this.checkIfTenderTypeIsIneligible.bind(this);
    this.showTenderBalance = this.showTenderBalance.bind(this);
  }

  onGAPaymentOptionSelected (type) {
    const { onGAAccountSelected } = this.props;
    onGAAccountSelected(type);
  }

  showTenderBalance (gaTenderAccount) {
    const { currencyDetails } = this.props;
    return currencyLocaleFormat(gaTenderAccount[gaTenderAccount.limitOnAccount ? 'remainingBalance' : 'chargeToDate'].amount, currencyDetails); // eslint-disable-line max-len
  }

  checkIfTenderTypeIsIneligible (gaAccount) {
    if (gaAccount.limitOnAccount) {
      const { total } = this.props;
      const remainingBalanceFloat = parseFloat(gaAccount.remainingBalance.amount);
      return total > remainingBalanceFloat;
    } else {
      return false;
    }
  }

  render () {
    const { gaAccountList, indexOfSelectedGAAccount, currencyDetails,
      getGAAccountInquiryError } = this.props;

    return (
      <GATenderTypesContainer>
        <div className='ga-payment-options-title' tabIndex={0}>
          <ModalText><Trans i18nKey='GA_SELECT_ACCOUNT'/></ModalText>
        </div>

        <RadioButtonContainer role='radiogroup'>
          {
            gaAccountList && gaAccountList.length > 0 &&
            gaAccountList.map((gaAccount, index) => (
              <React.Fragment key={`account-${index}`}>
                <RadioButton
                  className={`${gaAccount.gaTenderName}-radio`}
                  classDesc={`${gaAccount.gaTenderName}`}
                  type={gaAccount.gaTenderName}
                  selectedOption={this.onGAPaymentOptionSelected}
                  selected={index === indexOfSelectedGAAccount}
                  disabled={this.checkIfTenderTypeIsIneligible(gaAccount)}
                  buttonSize='30px'
                  tabIndex={this.checkIfTenderTypeIsIneligible(gaAccount) ? -1 : 0}
                  ariaLabel={gaAccount.gaTenderName}
                  balanceGA={indexOfSelectedGAAccount !== null && gaAccount.remainingBalance &&
                     this.showTenderBalance(gaAccount, currencyDetails)}
                  loader={indexOfSelectedGAAccount === index &&
                    !gaAccount.remainingBalance &&
                    getGAAccountInquiryError.length === 0}
                  label={gaAccount.gaTenderName}/>
              </React.Fragment>
            ))}
        </RadioButtonContainer>
      </GATenderTypesContainer>
    );
  }
}
