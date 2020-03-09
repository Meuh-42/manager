export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.phone.order', {
    url: '/order',
    views: {
      'lineView@telecom.telephony.billingAccount.line':
        'telephonyLinePhoneOrder',
    },
    resolve: {
      billingAccount: /* @ngInject */ ($transition$) =>
        $transition$.params().billingAccount,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
    translations: { value: ['.'], format: 'json' },
  });
};
