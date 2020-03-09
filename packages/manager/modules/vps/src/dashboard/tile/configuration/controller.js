import find from 'lodash/find';
import get from 'lodash/get';

export default class VpsDashboardTileConfigurationCtrl {
  constructor() {
    this.currentPlan = null;

    this.model = {
      ram: null,
      cpu: null,
    };

    this.upgrades = {
      ram: {
        plan: null,
        diff: null,
      },
      cpu: null,
    };
  }

  static getPlanPriceDiff(upperPlan, currentPlan) {
    const upperPlanTotalPriceValue = VpsDashboardTileConfigurationCtrl
      .getPlanPriceValue(upperPlan);
    const currentPlanTotalPriceValue = VpsDashboardTileConfigurationCtrl
      .getPlanPriceValue(currentPlan);

    console.log(upperPlanTotalPriceValue - currentPlanTotalPriceValue);
  }

  static getPlanPriceValue(plan) {
    return plan.prices.reduce((total, { price }) => total + price.value, 0);
  }

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.currentPlan = find(this.availableUpgrades, {
      planCode: this.stateVps.model.name.replace('2020', ''),
    });

    this.model.ram = this.currentPlan;

    const nextRamVps = find(this.catalog.products, ({ blobs }) => {
      if (!get(blobs, 'technical')) {
        return false;
      }

      const cpu = get(blobs, 'technical.cpu.cores');
      const ram = get(blobs, 'technical.memory.size');

      return cpu === this.vps.vcore
        && ram === this.vps.ram.value * 2;
    });

    this.upgrades.ram.plan = find(this.availableUpgrades, {
      planCode: nextRamVps.name,
    });

    this.upgrades.ram.diff = VpsDashboardTileConfigurationCtrl
      .getPlanPriceDiff(this.upgrades.ram.plan, this.currentPlan);
  }

  /* -----  End of Hooks  ------ */

};
