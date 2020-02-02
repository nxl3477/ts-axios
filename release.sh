set -e 
# 让用户输入版本
echo "Enter release version: "
# 读取版本
read VERSION
# -p 表示后面接收一个提示符  -n 1 表示限定最多一个字符的有效输入， -r 表示禁止转斜线的转译功能
read -p "Releasing $VERSION - are you sure ? (y/n)" -n 1 -r
echo # (optional) move to a new line 

if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"
  git push origin master

  # publish
  npm publish
fi