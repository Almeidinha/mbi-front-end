"use client"
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { Col, Layout, Row } from "antd"
import { useToggle } from "react-use"
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import Image from "next/image";

const { Content, Header, Sider } = Layout

interface MainLayoutProps {
  children?: React.ReactNode
  sideMenu?: React.ReactNode
  header?: React.ReactNode
  logo?: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = (props) => {

  const [isSiderCollapsed, toggleSiderCollapsed] = useToggle(false);

  const ToggleSiderIcon = isSiderCollapsed
  ? MenuUnfoldOutlined
  : MenuFoldOutlined;

  return (
    <Layout style={{height: '100vh'}} hasSider>
      <Sider
        trigger={null}
        collapsible
        collapsed={isSiderCollapsed}
        style={{height: '100%'}}
      >
        <Row align="middle" justify="center" style={{height: '64px' }}>
          <Col span={12} offset={8}>
            <Image src="/logo.svg" alt="" width={24} height={24}/>
          </Col>
        </Row>
        {props.sideMenu}
      </Sider>
      <Layout>
        <Header style={{ display: 'grid', paddingLeft: '12px'}}>
          <ToggleSiderIcon style={{  justifySelf: 'start', alignSelf: 'center', position: 'fixed', color: '#575859'}} onClick={toggleSiderCollapsed} />
          {props.header}
        </Header>
        <Content style={{margin: '12px 8px', padding: '12px', minHeight: '280px', overflow: 'auto'}}>
          <ProgressBar
            height="4px"
            color="#1677ff"
          />
          {props.children}
        </Content>
      </Layout>
    </Layout>
  )
}