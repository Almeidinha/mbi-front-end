import { ThemeConfig } from 'antd';

const customTheme: ThemeConfig = {
  components: {
    Layout: {
      headerBg: '#fff',
      bodyBg: '#f5f5f5',
      siderBg: '#fff',
    },
    Menu: {
      colorBgContainer: '#fff',
      subMenuItemBg: '#fff',
      itemColor: '#0000008a',
      itemSelectedColor: '#1677ff',
      itemHeight: 25,
      itemHoverColor: '#000000b5',
    },
    Card: {
      colorTextHeading: 'rgba(0, 0, 0, 0.45)'
    },
    Table: {
      colorTextHeading: 'rgba(0, 0, 0, 0.45)',
    },
  },
  
};

export default customTheme;