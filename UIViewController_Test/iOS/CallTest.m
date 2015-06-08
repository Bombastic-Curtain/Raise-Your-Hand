//
//  CallTest.m
//  UIViewController_Test
//
//  Created by Cheng Tian on 5/29/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "CallTest.h"
#import <Sinch/Sinch.h>


@interface CallTest ()
{
  id<SINClient> _client;
  id<SINCall> _call;
}
@end


@implementation CallTest
@synthesize phoneNumber, callButton;

-(void)initSinchClient
{
  _client = [Sinch clientWithApplicationKey:@"dff6bf13-c7a3-4842-8a68-e4d34ecbc4da"
                          applicationSecret:@"ERG90kpgEEShyfV08XHSSw=="
                            environmentHost:@"sandbox.sinch.com"
                                     userId:@"phonecaller"];
  _client.callClient.delegate = self;
  [_client setSupportCalling:YES];
  [_client start];
  
}

- (void)viewDidLoad {
  [super viewDidLoad];
  [self initSinchClient];
  // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}





- (IBAction)call:(id)sender {
  
  NSLog(@"***** call pressed *****");
  if (_call == nil)
  {
    NSLog(@"***** in here *****");
    
    _call = [[_client callClient] callPhoneNumber:phoneNumber.text];
    [callButton setTitle:@"Hangup" forState:UIControlStateNormal];
  }
  else
  {
    [_call hangup];
    [callButton setTitle:@"Call" forState:UIControlStateNormal];
  }
  
  
}
@end
