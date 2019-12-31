一般各大站点的 index.html 返回头。基本上都会设置成无缓存的，比如设置成：Cache-Control: max-age=0, must-revalidate

这个需要在nginx这层进行缓存设置哈