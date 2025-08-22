## Kiểm tra các element tiếng Việt chưa có thuộc tính i18n

Để tìm các element chứa tiếng Việt có dấu mà chưa có thuộc tính `i18n`, sử dụng Regex sau trong VS Code:

```
<([a-zA-Z0-9\-]+)(?![^>]*i18n)[^>]*>[^<]*[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]+[^<]*<\/\1>
```

**Cách dùng:**
- Mở hộp thoại tìm kiếm (Ctrl+Shift+F).
- Chọn "Use Regular Expression" (biểu tượng .*).
- Dán regex trên vào ô tìm kiếm.

**Loại trừ file .xlf:**
- Thêm vào ô "files to include": `!*.xlf`
- Hoặc vào phần "files to exclude" trong tìm kiếm: `*.xlf`