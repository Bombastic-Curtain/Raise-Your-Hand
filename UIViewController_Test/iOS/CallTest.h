//
//  CallTest.h
//  UIViewController_Test
//
//  Created by Cheng Tian on 5/29/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Sinch/Sinch.h>



@interface CallTest : UIViewController
<SINCallClientDelegate>

@property (weak, nonatomic) IBOutlet UITextField *phoneNumber;

@property (weak, nonatomic) IBOutlet UIButton *callButton;

- (IBAction)call:(id)sender;

@end
