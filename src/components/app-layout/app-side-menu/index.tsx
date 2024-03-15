"use client"
import { Menu, MenuProps } from "antd"
import { usePathname } from "next/navigation"
import { useRouter } from 'next-nprogress-bar';
import { useState } from "react";
import { uniq } from "lodash";
import { HomeOutlined, FundProjectionScreenOutlined, FolderOpenOutlined, DashboardOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';


type MenuItem = Required<MenuProps>['items'][number];

const getItem = (label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: 'group'): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const menuItems: MenuItem[] = [
  getItem("Home", "/", <HomeOutlined style={{fontSize: '24px'}} />),
  getItem("Análises", "/analysis", <FolderOpenOutlined style={{fontSize: '24px'}} />, [
    getItem("Todas", "/analysis/list"),
    getItem("Adicionar", "/analysis/add")
  ]),
  getItem("Dashboard", "/dashboard", <DashboardOutlined style={{fontSize: '24px'}} />, [
    getItem("Todos", "/dashboard/list"),
    getItem("Novo", "/dashboard/new")
  ]),
  getItem("Agendamentos", "/schedules", <MailOutlined style={{fontSize: '24px'}} />, [
    getItem("Analysis", "/schedules/analysis"),
  ]),
  getItem("Slide Show", "/slideShow", <FundProjectionScreenOutlined style={{fontSize: '24px'}} />, [
    getItem("Todos", "/slideShow/list"),
    getItem("Novo", "/slideShow/add")
  ]),
  getItem("Ferramentas", "/tools", <SettingOutlined style={{fontSize: '24px'}} />, [
    getItem("Admin", "/tools/admin", null, [
      getItem("Informações do usuário", "/tools/admin/user/1"), // TODO égar usuário do redux
      getItem("Usuarios", "/tools/admin/user/list"),
      getItem("Grupos", "/tools/admin/group/list"),
      getItem("Graph", "/tools/admin/graph"),
      getItem("Conexões", "/tools/admin/connections"),
      getItem("Geração de Calendário", "/tools/admin/calendar"),
      getItem("Permissões de Acesso", "/tools/admin/permissions"),
      getItem("Parâmetros", "/tools/admin/parameters"),
      getItem("Servidor de Email", "/tools/admin/mail"),
    ]),
    getItem("Analises", "/tools/analysis", null, [
      getItem("Anexos", "/tools/analysis/attachments"),
      getItem("Área", "/tools/analysis/area"),
      getItem("Casmpos", "/tools/analysis/fields"),
      getItem("Comentários", "/tools/analysis/comments"),
      getItem("Manutenção", "/tools/analysis/maintenance"),
      getItem("Permissões", "/tools/analysis/permissions")
    ]),
    getItem("Dashboard", "/tools/dashboard", null, [
      getItem("Manutenção", "/tools/dashboard/maintenance"),
      getItem("Permissões", "/tools/dashboard/permissions"),
    ]),
    getItem("Slide Show", "/tools/slideShow", null, [
      getItem("Manutenção", "/tools/slideShow/maintenance"),
    ]),
  ]),
  
]

const menus = [
  '/analysis',
  '/analysis/Favorites',
  '/analysis/lastAccessed',
  '/analysis/add',
  '/analysis/all',
  '/dashboard',
  "/dashboard/Favorites",
  "/dashboard/lastAccessed",
  "/dashboard/all",
  "/dashboard/new",
  '/schedules',
  '/schedules/analysis',
  '/slideShow',
  "/slideShow/Favorites",
  "/slideShow/all",
  "/slideShow/new",
  '/tools',
  "/tools/admin",
  "/tools/admin/userPass",
  "/tools/admin/connections",
  "/tools/admin/groups",
  "/tools/admin/users",
  "/tools/admin/accessKey",
  "/tools/admin/calendar",
  "/tools/admin/exceptions",
  "/tools/admin/logs",
  "/tools/admin/performance",
  "/tools/admin/permissions",
  "/tools/admin/parameters",
  "/tools/admin/server",
  "/tools/admin/mail",
  "/tools/admin/connectedUsers",
  '/tools/analysis',
  '/tools/analysis/attachments',
  '/tools/analysis/area',
  '/tools/analysis/fields',
  '/tools/analysis/comments',
  '/tools/analysis/export',
  '/tools/analysis/import',
  '/tools/analysis/maintenance',
  '/tools/analysis/permissions',
  "/tools/dashboard",
  "/tools/dashboard/maintenance",
  "/tools/dashboard/permissions",
  "/tools/slideShow",
  "/tools/slideShow/maintenance",
]

const rootMenuKeys =  uniq(menus.map((menu) => `/${menu.split('/')[1]}`))

export const AppSideMenu: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()

  const [openKeys, setOpenKeys] = useState<string[]>(rootMenuKeys.filter((key) => pathname.includes(key)));

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootMenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onSelect: MenuProps['onSelect'] = ({ key, keyPath }) => {
    if (keyPath.length === 1) {
      setOpenKeys([])
    }
    router.push(key as string)
  };

  return (
    <Menu
      theme="light"
      mode="inline"
      inlineIndent={15}
      openKeys={openKeys}
      defaultSelectedKeys={pathname ? menus.filter((menu) => pathname.includes(menu)) : []}
      onSelect={onSelect}
      onOpenChange={onOpenChange}
      items={menuItems}
    />
  )
}