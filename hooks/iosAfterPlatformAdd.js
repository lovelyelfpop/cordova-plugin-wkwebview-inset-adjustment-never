#!/usr/bin/env node

module.exports = function (ctx) {
    var fs = require('fs'),
        path = require('path');

    var platformRoot = path.join(ctx.opts.projectRoot, 'platforms', 'ios');

    // clear onReceivedSslError body
    var fileCDVWebViewEnginePath = path.join(platformRoot, 'CordovaLib', 'Classes', 'Private', 'Plugins', 'CDVWebViewEngine', 'CDVWebViewEngine.m');
    if (fs.existsSync(fileCDVWebViewEnginePath)) {
        var source = fs.readFileSync(fileCDVWebViewEnginePath, 'utf8');
        if (source.indexOf('[wkWebView.scrollView setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentNever];') < 0) {
            source = source.replace(
                'WKWebView* wkWebView = [[WKWebView alloc] initWithFrame:self.engineWebView.frame configuration:configuration];',
                `WKWebView* wkWebView = [[WKWebView alloc] initWithFrame:self.engineWebView.frame configuration:configuration];

    #if __IPHONE_OS_VERSION_MAX_ALLOWED >= 110000
        if (@available(iOS 11.0, *)) {
            [wkWebView.scrollView setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentNever];
        }
    #endif
`)
            fs.writeFileSync(fileCDVWebViewEnginePath, source, 'utf8');
        }
    }
};