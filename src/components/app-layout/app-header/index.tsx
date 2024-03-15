"use client"
import { Avatar, Dropdown, MenuProps, Space, Typography } from "antd";
import { signOut, useSession } from "next-auth/react";
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { clearStore } from "@/lib/helpers/localStorageUtils";
import { useRouter } from "next-nprogress-bar";
import { withProvider } from "@/lib/with-provider";
import { NextAuthProvider } from "@/app/providers";
import ImageWithFallback from "@/components/custom/ImageWithFallback";
import { defaultTo } from "lodash";

const AppHeader: React.FC = () => {
  const { data: session } = useSession();
  const { Title } = Typography;
  const router = useRouter()

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'home') {
      router.push("/");
    }
    if (key === 'log_out') {
      clearStore()
      signOut()
    }
  };

  const items: MenuProps['items'] = [
    {
      label: <Space><HomeOutlined />Home</Space>,
      key: 'home',
    },
    {
      label: <Space><LogoutOutlined style={{color: 'red'}} />log out</Space>,
      key: 'log_out',
    },
  ];

  return (
    <>
    <Title style={{margin: '18px 24px'}} level={4} type="secondary">Administrative Dashboard </Title>
    <Dropdown menu={{ items, onClick }} >
      <a onClick={(e) => e.preventDefault()} style={{justifySelf: 'end', alignSelf: 'center', position: 'fixed'}}>
          <Avatar
            style={{ backgroundColor: '#87d068' }}
            src={<ImageWithFallback src={defaultTo(session?.user?.image, '/user.svg')} alt="avatar" width={50} height={50}/>}
          />

      </a>
    </Dropdown>
    </>
  );
};

export default withProvider(NextAuthProvider) (AppHeader)