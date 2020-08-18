import { withInfo } from 'storybook-addon-vue-info';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import store from '../../.storybook/store';

import LocaleSelector from '../nacelle/LocaleSelector';

import { defaultLocales } from '../../tests/mocks/defaultObjects';

export default {
  title: 'Components | Locale Selector',
  decorators: [withInfo, withKnobs],
};

export const LocaleSelect = () => ({
  components: {
    LocaleSelector,
  },
  store,
  data() {
    return {
      localeList: defaultLocales.locales
    }
  },
  template: `
  <section class="section">
    <locale-selector
      :localeList="localeList"
    />
  </section>`,
});

LocaleSelect.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
