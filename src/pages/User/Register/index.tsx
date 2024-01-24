import Footer from '@/components/Footer';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import {Helmet, history, Link, useModel} from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import React, {useEffect, useState} from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import {listChartByPageUsingPOST} from "@/services/yubi/chartController";
import {getLoginUserUsingGET, userLoginUsingPOST, userRegisterUsingPOST} from "@/services/yubi/userController";



const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });


  useEffect(() => {
    listChartByPageUsingPOST({}).then(res => {
      console.error('res', res)
    })
  })

  /**
   * 登陆成功后，获取用户信息
   */
  const fetchUserInfo = async () => {
    const userInfo = await getLoginUserUsingGET();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: API.User) => {
    try {
      const res = await userRegisterUsingPOST(values);
      if (res.code === 0) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/user/login');
        return;
      } else {
        message.error(res.message);
      }
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        {'注册'}- {Settings.title}
      </Helmet>
      <div
        style={{
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%',
        }}
      >
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="佩鲁智能BI"
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '注册',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入账户'}
                rules={[
                  {
                    required: true,
                    message: '账户是必填项！',
                  },
                  {
                    min: 4,
                    type: 'string',
                    message: '账号不能小于4位！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码不能小于8位！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请再次输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码不能小于8位！',
                  },
                ]}
              />
            </>
          )}
          <div style={{ marginBottom: '20px' }}>
            <Link to="/user/login">已有账号</Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
