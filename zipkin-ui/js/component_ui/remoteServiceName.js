/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable prefer-template */
import {component} from 'flightjs';
import 'chosen-js';
import $ from 'jquery';
import queryString from 'query-string';

export default component(function remoteServiceName() {
  this.updateRemoteServices = function(ev, data) {
    this.render(data.remoteServices);
    this.trigger('chosen:updated');
  };

  this.render = function(remoteServices) {
    this.$node.empty();
    this.$node.append($($.parseHTML('<option value="all">all</option>')));

    const selectedRemoteServiceName = queryString.parse(window.location.search).remoteServiceName;
    $.each(remoteServices, (i, remoteService) => {
      const option = $($.parseHTML('<option/>'));
      option.val(remoteService);
      option.text(remoteService);
      if (remoteService === selectedRemoteServiceName) {
        option.prop('selected', true);
      }
      this.$node.append(option);
    });
  };

  this.after('initialize', function() {
    this.$node.chosen({
      search_contains: true
    });
    this.$node.next('.chosen-container');

    this.on(document, 'dataRemoteServiceNames', this.updateRemoteServices);
  });
});
