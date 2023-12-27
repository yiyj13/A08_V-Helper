## 文件功能

`xxx_mock.go` 和 `xxx_test.go` 均为单元测试所用文件，`xxx.go` 为功能文件。

`gen_mock.ps1` 是生成 `xxx_mock.go` 的 powershell 脚本

`coverage.out` 为上次生成的单元测试覆盖率报告

## 单元测试流程

生成 _mock.go 文件

```bash
# 替换 file_name 和 package_name
mockgen -source='<file_name>.go' -destination='<file_name>_mock.go' -package='<package_name>'
```

编写 _test.go 文件

```go
package service

import (
	"testing"
	"v-helper/internal/model"

	"github.com/golang/mock/gomock"
)

func TestXXX(t *testing.T) {
  // mock 使用方法见写好的 test 文件
}
```

使用 go test 进行测试

```bash
# 生成覆盖率报告
go test -coverprofile="coverage.out"
# 根据报告生成覆盖率可视化网页
go tool cover -html="coverage.out"
```