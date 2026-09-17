# 个人主页 V3 - 配置与发布指南

> 代码部分已全部完成，以下是你需要手动操作的步骤（涉及账号和密钥，无法代替）。

---

## 第一部分：Supabase 后台配置（约 10 分钟）

### 步骤 1：注册 Supabase 账号并创建项目

1. 打开 https://supabase.com ，点击 **Start your project**
2. 用 GitHub 账号登录（最方便）
3. 登录后点击 **New project**
4. 填写项目信息：
   - **Name**: `mysite-feedback`（或任意名字）
   - **Database Password**: 设置一个强密码（**记下来，但不要放进代码里**）
   - **Region**: 选离你近的，比如 `Southeast Asia (Singapore)` 或 `West US (North California)`
   - **Pricing**: 选免费版 Free
5. 点击 **Create new project**，等待 1-2 分钟项目初始化完成

### 步骤 2：执行建表和权限 SQL 脚本

1. 在项目左侧菜单点击 **SQL Editor**
2. 点击 **New query**
3. 打开项目根目录下的 `supabase_setup.sql` 文件，**全选复制**所有内容
4. 粘贴到 SQL Editor 的输入框中
5. 点击右下角 **Run** 执行
6. 看到 `Success. No rows returned` 表示执行成功

> 这个脚本做了三件事：创建 feedback 表、开启 RLS 行级安全、设置访客只能提交不能读取的权限策略。

### 步骤 3：验证表创建成功

1. 左侧菜单点击 **Table Editor**
2. 应该能看到 `feedback` 表
3. 点击表名，可以看到字段：id, name, relation, device, message, version, created_at

### 步骤 4：获取 API 配置（关键！）

1. 左侧菜单点击 **Settings**（齿轮图标）
2. 点击 **API**
3. 你会看到两个重要信息：
   - **Project URL**: 类似 `https://abcdefgh.supabase.co`
   - **Project API keys**: 找到 `anon` `public` 那一行，点击 **Reveal** 复制
4. **注意**：只用 `anon public` 这个 key，**绝对不要用 `service_role` secret key**！

---

## 第二部分：把配置填入网站代码

### 步骤 5：替换 index.html 中的配置

1. 用文本编辑器打开 `index.html`
2. 搜索 `SUPABASE_URL`，找到这两行：
   ```javascript
   var SUPABASE_URL = 'https://your-project-ref.supabase.co';
   var SUPABASE_ANON_KEY = 'your-anon-public-key';
   ```
3. 把第一个引号里的内容替换为你的 **Project URL**
4. 把第二个引号里的内容替换为你的 **anon public key**
5. 保存文件

### 步骤 6：本地测试反馈功能

1. 双击打开 `index.html`（或用浏览器打开）
2. 点击右下角的**蓝色反馈按钮**（聊天气泡图标），或滚动到"联系我"区域点击"给我反馈"
3. 填写表单：
   - 昵称：测试用户
   - 关系：朋友
   - 设备：电脑
   - 反馈内容：`这是一条测试反馈 - 2026-09-17`（加个唯一标记方便核对）
4. 点击**提交反馈**
5. 看到"反馈已收到！"的成功提示
6. 回到 Supabase → **Table Editor** → `feedback` 表
7. **确认能看到这条测试记录**，字段完整、时间正确

---

## 第三部分：发布到 GitHub Pages（约 5 分钟）

### 步骤 7：提交代码到 GitHub

你的项目已经关联了远程仓库，在项目目录执行：

```bash
git add .
git commit -m "V3: 添加反馈功能(Supabase)+发布准备"
git push origin main
```

### 步骤 8：启用 GitHub Pages

1. 打开你的仓库：https://github.com/philippe0517/mysite
2. 点击顶部 **Settings**
3. 左侧菜单找到 **Pages**
4. 在 **Build and deployment** 区域：
   - **Source**: 选 `Deploy from a branch`
   - **Branch**: 选 `main`，目录选 `/ (root)`
   - 点击 **Save**
5. 等待 1-2 分钟，页面顶部会出现绿色提示：`Your site is live at https://philippe0517.github.io/mysite/`

### 步骤 9：线上验证（最重要！）

1. 打开 `https://philippe0517.github.io/mysite/`
2. **电脑端测试**：
   - 页面正常加载，样式没有错乱
   - 点击右下角反馈按钮，弹窗正常显示
   - 提交一条测试反馈（内容写 `线上测试-电脑`）
   - 去 Supabase Table Editor 确认收到
3. **手机端测试**：
   - 用手机浏览器打开同一个网址
   - 页面布局正常（响应式）
   - 提交一条测试反馈（内容写 `线上测试-手机`）
   - 去 Supabase 确认收到

---

## 验收清单（V3 达标标准）

- [ ] Supabase 项目已创建，feedback 表存在
- [ ] RLS 已开启，访客只能 INSERT 不能 SELECT
- [ ] 网站右下角有反馈悬浮按钮
- [ ] 点击按钮弹出反馈表单（不跳转新页面）
- [ ] 表单字段：昵称（可选）、关系、设备、反馈内容（必填）
- [ ] 表单有"反馈不会公开"的隐私提示
- [ ] 提交中有加载状态，按钮禁用防止重复点击
- [ ] 提交成功显示成功提示
- [ ] 提交失败保留已输入内容并可重试
- [ ] Supabase 后台能看到提交的反馈记录
- [ ] 网站已发布到 GitHub Pages，有公开网址
- [ ] 用公开网址在电脑上能正常访问和提交反馈
- [ ] 用公开网址在手机上能正常访问和提交反馈
- [ ] 页脚显示"个人主页 V3"

---

## 安全提醒

1. **anon public key 可以放在前端**，这是设计如此，它受 RLS 权限限制
2. **service_role secret key 绝对不能放进前端代码或公开仓库**，它能绕过所有权限
3. 数据库密码不要出现在任何代码或截图中
4. 如果怀疑 key 泄露：Supabase → Settings → API → 点击 **Reset API keys** 轮换密钥
